import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@speedy-van/db";
import {
  ok,
  fail,
  DriverStatusUpdateSchema,
  DriverLocationSchema,
  maskPostcode,
} from "@speedy-van/shared";
import { requireDriver } from "../middleware/auth";
import {
  acceptJob,
  rejectJob,
  updateJobStatus,
  JobAlreadyTakenError,
} from "../services/job.service";
import { trackDriverLocation } from "../services/tracking.service";

const app = new Hono();
app.use("*", requireDriver);

async function getDriver(userId: string) {
  return db.driver.findUnique({ where: { userId } });
}

app.get("/dashboard", async (c) => {
  const userId = c.get("userId") as string;
  const driver = await getDriver(userId);
  if (!driver) return c.json(fail("Driver profile missing", "NOT_FOUND"), 404);

  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setUTCDate(startOfDay.getUTCDate() - startOfDay.getUTCDay());

  const [todayJobs, completedToday, totalCompleted, weekJobs, nextJob, todaySchedule] =
    await Promise.all([
      db.driverJob.count({
        where: { driverId: driver.id, booking: { scheduledAt: { gte: startOfDay } } },
      }),
      db.booking.findMany({
        where: { driverId: driver.id, status: "COMPLETED", scheduledAt: { gte: startOfDay } },
      }),
      db.booking.count({ where: { driverId: driver.id, status: "COMPLETED" } }),
      db.booking.findMany({
        where: { driverId: driver.id, status: "COMPLETED", scheduledAt: { gte: startOfWeek } },
      }),
      db.driverJob.findFirst({
        where: { driverId: driver.id, status: { not: "COMPLETED" } },
        include: { booking: true },
        orderBy: { booking: { scheduledAt: "asc" } },
      }),
      db.booking.findMany({
        where: { driverId: driver.id, scheduledAt: { gte: startOfDay } },
        orderBy: { scheduledAt: "asc" },
      }),
    ]);

  const sum = (arr: { totalPrice: number }[]) => arr.reduce((acc, b) => acc + b.totalPrice, 0);

  return c.json(
    ok({
      todayJobs,
      todayEarnings: sum(completedToday),
      totalCompletedJobs: totalCompleted,
      nextJob,
      todaySchedule,
      weekStats: { completed: weekJobs.length, earnings: sum(weekJobs) },
    }),
  );
});

app.get(
  "/jobs",
  zValidator(
    "query",
    z.object({
      service: z.string().optional(),
      area: z.string().optional(),
      date: z.string().optional(),
      sort: z.enum(["newest", "highest", "shortest"]).optional(),
    }),
  ),
  async (c) => {
    const { service, area, date, sort } = c.req.valid("query");
    const orderBy =
      sort === "highest"
        ? { booking: { totalPrice: "desc" as const } }
        : sort === "shortest"
        ? { booking: { distanceMiles: "asc" as const } }
        : { createdAt: "desc" as const };

    const jobs = await db.driverJob.findMany({
      where: {
        status: "AVAILABLE",
        isPublic: true,
        driverId: null,
        ...(service ? { booking: { serviceSlug: service } } : {}),
        ...(area ? { booking: { pickupPostcode: { startsWith: area, mode: "insensitive" as const } } } : {}),
        ...(date
          ? {
              booking: {
                scheduledAt: {
                  gte: new Date(date),
                  lt: new Date(new Date(date).getTime() + 86_400_000),
                },
              },
            }
          : {}),
      },
      include: { booking: true },
      orderBy,
    });

    // Privacy: only postcode outward code until accepted
    const sanitized = jobs.map((j) => ({
      id: j.id,
      status: j.status,
      createdAt: j.createdAt,
      booking: {
        id: j.booking.id,
        reference: j.booking.reference,
        serviceName: j.booking.serviceName,
        serviceSlug: j.booking.serviceSlug,
        scheduledAt: j.booking.scheduledAt,
        selectedTimeSlot: j.booking.selectedTimeSlot,
        pickupPostcode: maskPostcode(j.booking.pickupPostcode),
        dropoffPostcode: maskPostcode(j.booking.dropoffPostcode),
        distanceMiles: j.booking.distanceMiles,
        totalPrice: j.booking.totalPrice,
        helpersCount: j.booking.helpersCount,
        needsPacking: j.booking.needsPacking,
        needsAssembly: j.booking.needsAssembly,
      },
    }));

    return c.json(ok({ jobs: sanitized }));
  },
);

app.post("/jobs/:id/accept", async (c) => {
  const userId = c.get("userId") as string;
  const driver = await getDriver(userId);
  if (!driver) return c.json(fail("Driver profile missing", "NOT_FOUND"), 404);
  try {
    const job = await acceptJob(c.req.param("id"), driver.id);
    return c.json(ok({ success: true, job }));
  } catch (err) {
    if (err instanceof JobAlreadyTakenError) {
      return c.json(fail(err.message, "JOB_TAKEN"), 409);
    }
    throw err;
  }
});

app.get(
  "/my-jobs",
  zValidator(
    "query",
    z.object({
      status: z.enum(["upcoming", "in_progress", "completed", "all"]).optional(),
    }),
  ),
  async (c) => {
    const userId = c.get("userId") as string;
    const driver = await getDriver(userId);
    if (!driver) return c.json(fail("Driver profile missing", "NOT_FOUND"), 404);

    const { status } = c.req.valid("query");
    const statusFilter =
      status === "upcoming"
        ? { in: ["ACCEPTED"] as const }
        : status === "in_progress"
        ? { in: ["DRIVER_EN_ROUTE", "ARRIVED_PICKUP", "LOADING", "IN_TRANSIT", "ARRIVED_DROPOFF", "UNLOADING"] as const }
        : status === "completed"
        ? { equals: "COMPLETED" as const }
        : undefined;

    const jobs = await db.driverJob.findMany({
      where: {
        driverId: driver.id,
        ...(statusFilter ? { status: statusFilter as never } : {}),
      },
      include: { booking: { include: { items: true, conversation: { select: { id: true } } } } },
      orderBy: { booking: { scheduledAt: "asc" } },
    });

    return c.json(ok({ jobs }));
  },
);

app.patch(
  "/my-jobs/:id/status",
  zValidator("json", DriverStatusUpdateSchema),
  async (c) => {
    const userId = c.get("userId") as string;
    const driver = await getDriver(userId);
    if (!driver) return c.json(fail("Driver profile missing", "NOT_FOUND"), 404);

    const job = await db.driverJob.findUnique({ where: { id: c.req.param("id") } });
    if (!job || job.driverId !== driver.id) {
      return c.json(fail("Job not found", "NOT_FOUND"), 404);
    }

    const { status, note } = c.req.valid("json");
    const updated = await updateJobStatus(job.id, status, userId, note);
    return c.json(ok({ success: true, job: updated }));
  },
);

app.post(
  "/my-jobs/:id/reject",
  zValidator("json", z.object({ reason: z.string().min(1) })),
  async (c) => {
    const userId = c.get("userId") as string;
    const driver = await getDriver(userId);
    if (!driver) return c.json(fail("Driver profile missing", "NOT_FOUND"), 404);

    const job = await db.driverJob.findUnique({ where: { id: c.req.param("id") } });
    if (!job || job.driverId !== driver.id) {
      return c.json(fail("Job not found", "NOT_FOUND"), 404);
    }
    const { reason } = c.req.valid("json");
    await rejectJob(job.id, reason);
    return c.json(ok({ success: true }));
  },
);

app.post(
  "/tracking/location",
  zValidator("json", DriverLocationSchema),
  async (c) => {
    const userId = c.get("userId") as string;
    const driver = await getDriver(userId);
    if (!driver) return c.json(fail("Driver profile missing", "NOT_FOUND"), 404);
    const { bookingId, lat, lng } = c.req.valid("json");
    const booking = await db.booking.findUnique({ where: { id: bookingId } });
    if (!booking || booking.driverId !== driver.id) {
      return c.json(fail("Booking not found", "NOT_FOUND"), 404);
    }
    await trackDriverLocation(bookingId, lat, lng);
    return c.json(ok({ success: true }));
  },
);

app.get("/profile", async (c) => {
  const userId = c.get("userId") as string;
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, phone: true, role: true, driver: true },
  });
  return c.json(ok({ user }));
});

app.patch(
  "/profile",
  zValidator("json", z.object({ name: z.string().optional(), phone: z.string().optional() })),
  async (c) => {
    const userId = c.get("userId") as string;
    const data = c.req.valid("json");
    const user = await db.user.update({
      where: { id: userId },
      data,
      select: { id: true, name: true, email: true, phone: true, role: true },
    });
    return c.json(ok({ user }));
  },
);

// Proof of delivery photo — accepts base64 or URL
app.post(
  "/my-jobs/:id/photo",
  zValidator(
    "json",
    z.object({
      image: z.string().optional(),          // base64 string from iOS
      imageUrl: z.string().optional(),       // legacy URL
      type: z.enum(["proof_of_delivery", "before", "after", "damage"]).optional(),
    }),
  ),
  async (c) => {
    const userId = c.get("userId") as string;
    const driver = await getDriver(userId);
    if (!driver) return c.json(fail("Driver profile missing", "NOT_FOUND"), 404);

    const job = await db.driverJob.findUnique({ where: { id: c.req.param("id") }, include: { booking: true } });
    if (!job || job.driverId !== driver.id) return c.json(fail("Not found", "NOT_FOUND"), 404);

    const { image, imageUrl, type } = c.req.valid("json");
    // Prefer base64 image stored as data URL; fall back to provided URL
    const finalUrl = image
      ? `data:image/jpeg;base64,${image}`
      : (imageUrl ?? null);

    if (!finalUrl) return c.json(fail("No image provided", "VALIDATION_ERROR"), 400);

    const updated = await db.driverJob.update({
      where: { id: job.id },
      data: { proofImageUrl: finalUrl },
    });

    await db.trackingEvent.create({
      data: {
        bookingId: job.bookingId,
        type: "photo_added",
        message: `${type ?? "proof_of_delivery"} photo uploaded`,
        actorId: userId,
        actorRole: "DRIVER",
      },
    });

    return c.json(ok({ imageUrl: updated.proofImageUrl }));
  },
);

// Signature collection
app.post(
  "/my-jobs/:id/signature",
  zValidator(
    "json",
    z.object({
      signatureData: z.string().min(1),
      signerName: z.string().min(1),
    }),
  ),
  async (c) => {
    const userId = c.get("userId") as string;
    const driver = await getDriver(userId);
    if (!driver) return c.json(fail("Driver profile missing", "NOT_FOUND"), 404);

    const job = await db.driverJob.findUnique({ where: { id: c.req.param("id") }, include: { booking: true } });
    if (!job || job.driverId !== driver.id) return c.json(fail("Not found", "NOT_FOUND"), 404);

    const { signatureData, signerName } = c.req.valid("json");
    const signatureUrl = `data:image/png;base64,${signatureData}`;

    await db.trackingEvent.create({
      data: {
        bookingId: job.bookingId,
        type: "signature_collected",
        message: `Signature collected from ${signerName}`,
        actorId: userId,
        actorRole: "DRIVER",
      },
    });

    return c.json(ok({ signatureUrl }));
  },
);

// Delivery notes
app.post(
  "/my-jobs/:id/notes",
  zValidator("json", z.object({ notes: z.string().min(1).max(2000) })),
  async (c) => {
    const userId = c.get("userId") as string;
    const driver = await getDriver(userId);
    if (!driver) return c.json(fail("Driver profile missing", "NOT_FOUND"), 404);

    const job = await db.driverJob.findUnique({ where: { id: c.req.param("id") }, include: { booking: true } });
    if (!job || job.driverId !== driver.id) return c.json(fail("Not found", "NOT_FOUND"), 404);

    const { notes } = c.req.valid("json");
    await db.driverJob.update({ where: { id: job.id }, data: { notes } });

    await db.trackingEvent.create({
      data: {
        bookingId: job.bookingId,
        type: "note_added",
        message: notes,
        actorId: userId,
        actorRole: "DRIVER",
        isInternal: true,
      },
    });

    return c.json(ok({ success: true }));
  },
);

// Earnings breakdown
app.get("/earnings", async (c) => {
  const userId = c.get("userId") as string;
  const driver = await getDriver(userId);
  if (!driver) return c.json(fail("Driver profile missing", "NOT_FOUND"), 404);

  const now = new Date();
  const startOfToday = new Date(now); startOfToday.setUTCHours(0, 0, 0, 0);
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setUTCDate(startOfToday.getUTCDate() - ((startOfToday.getUTCDay() + 6) % 7)); // Mon
  const startOfMonth = new Date(now.getUTCFullYear(), now.getUTCMonth(), 1);

  const allJobs = await db.driverJob.findMany({
    where: { driverId: driver.id, driverPay: { gt: 0 } },
    select: { driverPay: true, driverPayStatus: true, completedAt: true, createdAt: true },
    orderBy: { completedAt: "desc" },
  });

  const sumPaid = (jobs: typeof allJobs) =>
    jobs.reduce((s, j) => s + (j.driverPay ?? 0), 0);

  const paidJobs = allJobs.filter((j) => j.driverPayStatus === "paid");
  const unpaidJobs = allJobs.filter((j) => j.driverPayStatus === "unpaid");

  const todayPaid = paidJobs.filter((j) => j.completedAt && j.completedAt >= startOfToday);
  const weekPaid = paidJobs.filter((j) => j.completedAt && j.completedAt >= startOfWeek);
  const monthPaid = paidJobs.filter((j) => j.completedAt && j.completedAt >= startOfMonth);

  // Daily breakdown for recent payments (last 14 days)
  const cutoff = new Date(startOfToday); cutoff.setUTCDate(cutoff.getUTCDate() - 13);
  const recentMap = new Map<string, { jobs: number; amount: number }>();
  for (const j of paidJobs.filter((x) => x.completedAt && x.completedAt >= cutoff)) {
    const day = j.completedAt!.toISOString().slice(0, 10);
    const existing = recentMap.get(day) ?? { jobs: 0, amount: 0 };
    recentMap.set(day, { jobs: existing.jobs + 1, amount: existing.amount + (j.driverPay ?? 0) });
  }
  const recentPayments = Array.from(recentMap.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 10)
    .map(([date, { jobs, amount }]) => ({ date, amount, jobCount: jobs }));

  const dailyCap = 500;

  return c.json(
    ok({
      today: { jobs: todayPaid.length, amount: sumPaid(todayPaid) },
      thisWeek: { jobs: weekPaid.length, amount: sumPaid(weekPaid) },
      thisMonth: { jobs: monthPaid.length, amount: sumPaid(monthPaid) },
      allTime: { jobs: paidJobs.length, amount: sumPaid(paidJobs) },
      unpaid: { jobs: unpaidJobs.length, amount: sumPaid(unpaidJobs) },
      recentPayments,
      dailyCap,
      todayRemaining: Math.max(0, dailyCap - sumPaid(todayPaid)),
    }),
  );
});

// Performance stats
app.get("/stats", async (c) => {
  const userId = c.get("userId") as string;
  const driver = await getDriver(userId);
  if (!driver) return c.json(fail("Driver profile missing", "NOT_FOUND"), 404);

  const [acceptedCount, completedCount, totalOffered, reviewData, allDrivers] = await Promise.all([
    db.driverJob.count({ where: { driverId: driver.id, status: { not: "AVAILABLE" } } }),
    db.driverJob.count({ where: { driverId: driver.id, status: "COMPLETED" } }),
    db.driverJob.count({ where: { driverId: driver.id } }),
    db.review.aggregate({
      _avg: { rating: true },
      _count: { rating: true },
      where: { booking: { driverId: driver.id } },
    }),
    db.driverJob.groupBy({
      by: ["driverId"],
      where: { status: "COMPLETED", driverId: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),
  ]);

  const acceptanceRate =
    totalOffered > 0 ? Math.round((acceptedCount / totalOffered) * 100) : 100;
  const completionRate =
    acceptedCount > 0 ? Math.round((completedCount / acceptedCount) * 100) : 100;
  const avgRating = reviewData._avg.rating ?? 5.0;
  const totalReviews = reviewData._count.rating;

  const rankIdx = allDrivers.findIndex((d) => d.driverId === driver.id);
  const rank = rankIdx === -1 ? allDrivers.length + 1 : rankIdx + 1;

  const achievements = [
    {
      id: "first_job",
      title: "First Delivery",
      description: "Complete your first job",
      earned: completedCount >= 1,
    },
    {
      id: "ten_jobs",
      title: "Ten Deliveries",
      description: "Complete 10 jobs",
      earned: completedCount >= 10,
    },
    {
      id: "fifty_jobs",
      title: "Road Warrior",
      description: "Complete 50 jobs",
      earned: completedCount >= 50,
    },
    {
      id: "top_rated",
      title: "Top Rated",
      description: "Maintain 4.8+ average rating",
      earned: totalReviews >= 5 && avgRating >= 4.8,
    },
  ];

  return c.json(
    ok({
      acceptanceRate,
      completionRate,
      onTimeRate: 95,
      avgRating: Math.round(avgRating * 10) / 10,
      totalReviews,
      rank,
      totalDrivers: allDrivers.length || 1,
      achievements,
    }),
  );
});

// Leaderboard (top 20 drivers by completed jobs this month)
app.get("/leaderboard", async (c) => {
  const userId = c.get("userId") as string;
  const driver = await getDriver(userId);
  if (!driver) return c.json(fail("Driver profile missing", "NOT_FOUND"), 404);

  const startOfMonth = new Date();
  startOfMonth.setUTCDate(1);
  startOfMonth.setUTCHours(0, 0, 0, 0);

  const top = await db.driverJob.groupBy({
    by: ["driverId"],
    where: {
      status: "COMPLETED",
      driverId: { not: null },
      completedAt: { gte: startOfMonth },
    },
    _count: { id: true },
    _sum: { driverPay: true },
    orderBy: { _count: { id: "desc" } },
    take: 20,
  });

  // Fetch user names for display
  const driverIds = top.map((d) => d.driverId as string);
  const users = await db.driver.findMany({
    where: { id: { in: driverIds } },
    include: { user: { select: { name: true } } },
  });
  const nameMap = new Map(users.map((d) => [d.id, d.user.name]));

  const drivers = top.map((d, idx) => {
    const fullName = nameMap.get(d.driverId as string) ?? "Driver";
    const parts = fullName.trim().split(" ");
    const displayName =
      d.driverId === driver.id
        ? "You"
        : `${parts[0]} ${parts[1]?.[0] ?? ""}.`.trimEnd();
    return {
      rank: idx + 1,
      name: displayName,
      completedJobs: d._count.id,
      earnings: d._sum.driverPay ?? 0,
      isCurrentUser: d.driverId === driver.id,
    };
  });

  // If current driver not in top 20, append their position
  const inList = drivers.some((d) => d.isCurrentUser);
  if (!inList) {
    const myCount = await db.driverJob.count({
      where: { driverId: driver.id, status: "COMPLETED", completedAt: { gte: startOfMonth } },
    });
    const myEarnings = await db.driverJob.aggregate({
      where: { driverId: driver.id, status: "COMPLETED", completedAt: { gte: startOfMonth } },
      _sum: { driverPay: true },
    });
    const myRank =
      top.filter((d) => (d._count.id ?? 0) > myCount).length + 1;
    drivers.push({
      rank: myRank,
      name: "You",
      completedJobs: myCount,
      earnings: myEarnings._sum.driverPay ?? 0,
      isCurrentUser: true,
    });
  }

  return c.json(ok({ period: "this_month", drivers }));
});

// Notifications
app.get("/notifications", async (c) => {
  const userId = c.get("userId") as string;
  const notifications = await db.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      type: true,
      title: true,
      body: true,
      isRead: true,
      link: true,
      createdAt: true,
    },
  });
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  return c.json(ok({ notifications, unreadCount }));
});

app.post(
  "/notifications/read",
  zValidator(
    "json",
    z.union([
      z.object({ ids: z.array(z.string()) }),
      z.object({ all: z.literal(true) }),
    ]),
  ),
  async (c) => {
    const userId = c.get("userId") as string;
    const body = c.req.valid("json");
    if ("all" in body) {
      await db.notification.updateMany({ where: { userId }, data: { isRead: true } });
    } else {
      await db.notification.updateMany({
        where: { userId, id: { in: body.ids } },
        data: { isRead: true },
      });
    }
    return c.json(ok({ success: true }));
  },
);

// Save push notification token
app.post(
  "/push-token",
  zValidator(
    "json",
    z.object({
      token: z.string().min(1),
      platform: z.enum(["ios", "android"]),
    }),
  ),
  async (c) => {
    const userId = c.get("userId") as string;
    const { token, platform } = c.req.valid("json");
    await db.user.update({
      where: { id: userId },
      data: { pushToken: token, pushPlatform: platform },
    });
    return c.json(ok({ success: true }));
  },
);

export default app;
