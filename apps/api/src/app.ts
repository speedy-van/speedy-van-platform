import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { ALLOWED_ORIGINS } from "@speedy-van/config";
import { errorHandler } from "./middleware/error";

import healthRoutes from "./routes/health";
import authRoutes from "./routes/auth";
import bookingRoutes from "./routes/booking";
import pricingRoutes from "./routes/pricing";
import itemsRoutes from "./routes/items";
import geocodeRoutes from "./routes/geocode";
import stripeRoutes from "./routes/stripe";
import driverRoutes from "./routes/driver";
import trackingRoutes from "./routes/tracking";
import chatRoutes, { bookingMessagesApp } from "./routes/chat";
import weatherRoutes from "./routes/weather";
import serviceFlagsRoutes from "./routes/service-flags";
import waitlistRoutes from "./routes/waitlist";
import enquiryRoutes from "./routes/enquiry";

import adminBookingsRoutes from "./routes/admin/bookings";
import adminDriversRoutes from "./routes/admin/drivers";
import adminPricingRoutes from "./routes/admin/pricing";
import adminJobsRoutes from "./routes/admin/jobs";
import adminContentRoutes from "./routes/admin/content";
import adminAnalyticsRoutes from "./routes/admin/analytics";
import adminVisitorsRoutes from "./routes/admin/visitors";
import adminNotificationsRoutes from "./routes/admin/notifications";
import adminServiceFlagsRoutes from "./routes/admin/service-flags";
import adminEnquiriesRoutes from "./routes/admin/enquiries";

const app = new Hono();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: [...ALLOWED_ORIGINS],
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "stripe-signature"],
  }),
);

app.onError(errorHandler);

app.route("/", healthRoutes);
app.route("/auth", authRoutes);
app.route("/booking", bookingRoutes);
app.route("/pricing", pricingRoutes);
app.route("/items", itemsRoutes);
app.route("/geocode", geocodeRoutes);
app.route("/stripe", stripeRoutes);
app.route("/driver", driverRoutes);
app.route("/tracking", trackingRoutes);
app.route("/chat", chatRoutes);
app.route("/chat", bookingMessagesApp);
app.route("/weather", weatherRoutes);
app.route("/service-flags", serviceFlagsRoutes);
app.route("/waitlist", waitlistRoutes);
app.route("/enquiry", enquiryRoutes);

app.route("/admin/bookings", adminBookingsRoutes);
app.route("/admin/drivers", adminDriversRoutes);
app.route("/admin/pricing", adminPricingRoutes);
app.route("/admin/jobs", adminJobsRoutes);
app.route("/admin/content", adminContentRoutes);
app.route("/admin/analytics", adminAnalyticsRoutes);
app.route("/admin/visitors", adminVisitorsRoutes);
app.route("/admin/notifications", adminNotificationsRoutes);
app.route("/admin/service-flags", adminServiceFlagsRoutes);
app.route("/admin/enquiries", adminEnquiriesRoutes);

export default app;
