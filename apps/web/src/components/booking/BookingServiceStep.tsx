"use client";

import Image from "next/image";
import { useBooking } from "@/lib/booking-store";
import {
  BOOKING_SERVICE_OPTIONS,
  getBookingServiceStartingFrom,
} from "@/lib/booking-service-options";
import { getServiceImage } from "@/lib/service-images";

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

export function BookingServiceStep() {
  const { dispatch } = useBooking();

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-amber-300">
          Start your quote
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-white">
          What do you need moved?
        </h1>
        <p className="mt-2 max-w-2xl text-base font-semibold leading-6 text-white">
          Choose the closest option. You can add addresses, access details, items,
          and moving help next.
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" role="list">
        {BOOKING_SERVICE_OPTIONS.map((option) => {
          const startingFrom = getBookingServiceStartingFrom(option);
          const priceLabel = startingFrom ? `From ${money.format(startingFrom)}` : "Start quote";

          return (
            <li key={option.id}>
              <button
                type="button"
                onClick={() => dispatch({ type: "APPLY_SERVICE_ENTRY", slug: option.id })}
                className="group flex h-full min-h-[330px] w-full flex-col overflow-hidden rounded-2xl border border-amber-400/30 bg-white/[0.055] text-left shadow-[0_14px_38px_rgba(0,0,0,0.42)] transition hover:-translate-y-1 hover:border-amber-300 hover:bg-white/[0.075] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <span className="relative block h-40 w-full overflow-hidden border-b border-amber-400/25">
                  <Image
                    src={getServiceImage(option.imageSlug)}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-black">
                    {priceLabel}
                  </span>
                </span>

                <span className="flex flex-1 flex-col p-5">
                  <span className="text-lg font-black text-white">{option.label}</span>
                  <span className="mt-2 text-sm font-semibold leading-6 text-booking-body">
                    {option.description}
                  </span>
                  <span className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-2.5 py-1 text-xs font-bold text-amber-300">
                      {option.pathBadge}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-bold text-white/70">
                      {option.scopeBadge}
                    </span>
                  </span>
                  <span className="mt-auto pt-5 text-sm font-black text-amber-300">
                    Start this quote
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
