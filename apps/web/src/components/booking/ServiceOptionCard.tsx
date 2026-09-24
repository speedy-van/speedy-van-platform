"use client";

import Image from "next/image";
import type { Service } from "@/lib/services";
import { getServiceImage } from "@/lib/service-images";

export interface ServiceOptionCardProps {
  service: Service;
  mappedServiceName: string;
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
}

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

export function ServiceOptionCard({
  service,
  mappedServiceName,
  selected,
  disabled = false,
  onSelect,
}: ServiceOptionCardProps) {
  const mapsToDifferentService = mappedServiceName !== service.name;

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      className={`group grid min-h-[176px] grid-cols-[minmax(0,1fr)_92px] gap-4 rounded-2xl border bg-white p-4 text-left shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55 sm:grid-cols-[minmax(0,1fr)_112px] ${
        selected
          ? "border-primary-400 bg-primary-50 ring-2 ring-primary-400/25"
          : "border-slate-200 hover:border-primary-200 hover:shadow-md"
      }`}
    >
      <span className="flex min-w-0 flex-col">
        <span className="flex items-start justify-between gap-3">
          <span className="text-lg font-bold leading-tight text-stone-950">{service.name}</span>
          <span
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
              selected ? "border-primary-400 bg-primary-400 text-white" : "border-slate-300 bg-white text-transparent"
            }`}
            aria-hidden="true"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4L8.5 12l6.8-6.8a1 1 0 011.4.1z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </span>
        <span className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
          {service.description}
        </span>
        <span className="mt-auto flex flex-wrap items-center gap-2 pt-4 text-xs font-semibold text-slate-500">
          <span className="rounded-full bg-white px-2.5 py-1 text-slate-700 ring-1 ring-slate-200">
            From {money.format(service.startingFrom)}
          </span>
          {mapsToDifferentService && (
            <span className="rounded-full bg-primary-50 px-2.5 py-1 text-primary-700 ring-1 ring-primary-100">
              Books as {mappedServiceName}
            </span>
          )}
        </span>
      </span>
      <span className="relative min-h-28 overflow-hidden rounded-xl bg-slate-100">
        <Image
          src={getServiceImage(service.slug)}
          alt=""
          fill
          sizes="112px"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </span>
    </button>
  );
}
