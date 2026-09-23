"use client";

/* eslint-disable @next/next/no-img-element */

import { useMemo } from "react";
import type { AddressResult } from "@/lib/booking-store";
import type { RouteGeometry } from "@/lib/geocode-client";

type RouteMapProps = {
  pickup: AddressResult | null;
  dropoff: AddressResult | null;
  routeGeometry?: RouteGeometry;
  distanceMiles?: number;
  durationMinutes?: number;
  loading?: boolean;
};

type MapTile = {
  key: string;
  src: string;
  left: number;
  top: number;
};

type ProjectedPoint = {
  x: number;
  y: number;
};

const TILE_SIZE = 256;
const MAP_WIDTH = 960;
const MAP_HEIGHT = 270;
const MAP_PADDING = 44;
const MIN_ZOOM = 5;
const MAX_ZOOM = 12;

function hasCoordinates(point: AddressResult | null): point is AddressResult {
  return Boolean(point && Number.isFinite(point.lat) && Number.isFinite(point.lng) && point.lat !== 0 && point.lng !== 0);
}

function shortAddress(point: AddressResult | null): string {
  if (!point) return "Not selected";
  return point.postcode || point.address.split(",")[0] || "Selected";
}

function fallbackGeometry(pickup: AddressResult, dropoff: AddressResult): RouteGeometry {
  return {
    type: "LineString",
    coordinates: [
      [pickup.lng, pickup.lat],
      [dropoff.lng, dropoff.lat],
    ],
  };
}

function worldSize(zoom: number): number {
  return TILE_SIZE * 2 ** zoom;
}

function lngLatToWorld([lng, lat]: [number, number], zoom: number): ProjectedPoint {
  const size = worldSize(zoom);
  const sinLat = Math.sin((Math.max(Math.min(lat, 85.05112878), -85.05112878) * Math.PI) / 180);

  return {
    x: ((lng + 180) / 360) * size,
    y: (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * size,
  };
}

function chooseZoom(coordinates: [number, number][]): number {
  for (let zoom = MAX_ZOOM; zoom >= MIN_ZOOM; zoom -= 1) {
    const points = coordinates.map((coordinate) => lngLatToWorld(coordinate, zoom));
    const minX = Math.min(...points.map((point) => point.x));
    const maxX = Math.max(...points.map((point) => point.x));
    const minY = Math.min(...points.map((point) => point.y));
    const maxY = Math.max(...points.map((point) => point.y));

    if (maxX - minX <= MAP_WIDTH - MAP_PADDING * 2 && maxY - minY <= MAP_HEIGHT - MAP_PADDING * 2) {
      return zoom;
    }
  }

  return MIN_ZOOM;
}

function wrapTileX(x: number, zoom: number): number {
  const count = 2 ** zoom;
  return ((x % count) + count) % count;
}

function buildTileMap(geometry?: RouteGeometry) {
  if (!geometry || geometry.coordinates.length < 2) return null;

  const coordinates = geometry.coordinates;
  const zoom = chooseZoom(coordinates);
  const worldPoints = coordinates.map((coordinate) => lngLatToWorld(coordinate, zoom));
  const minX = Math.min(...worldPoints.map((point) => point.x));
  const maxX = Math.max(...worldPoints.map((point) => point.x));
  const minY = Math.min(...worldPoints.map((point) => point.y));
  const maxY = Math.max(...worldPoints.map((point) => point.y));
  const centreX = (minX + maxX) / 2;
  const centreY = (minY + maxY) / 2;
  const offsetX = MAP_WIDTH / 2 - centreX;
  const offsetY = MAP_HEIGHT / 2 - centreY;
  const tileMinX = Math.floor((-offsetX) / TILE_SIZE);
  const tileMaxX = Math.floor((MAP_WIDTH - offsetX) / TILE_SIZE);
  const tileMinY = Math.floor((-offsetY) / TILE_SIZE);
  const tileMaxY = Math.floor((MAP_HEIGHT - offsetY) / TILE_SIZE);
  const maxTile = 2 ** zoom - 1;
  const tiles: MapTile[] = [];

  for (let tileX = tileMinX; tileX <= tileMaxX; tileX += 1) {
    for (let tileY = Math.max(0, tileMinY); tileY <= Math.min(maxTile, tileMaxY); tileY += 1) {
      const wrappedX = wrapTileX(tileX, zoom);
      tiles.push({
        key: `${zoom}-${wrappedX}-${tileY}`,
        src: `https://tile.openstreetmap.org/${zoom}/${wrappedX}/${tileY}.png`,
        left: tileX * TILE_SIZE + offsetX,
        top: tileY * TILE_SIZE + offsetY,
      });
    }
  }

  const projectedRoute = worldPoints.map((point) => ({
    x: point.x + offsetX,
    y: point.y + offsetY,
  }));

  return {
    tiles,
    routePath: projectedRoute.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" "),
    pickup: projectedRoute[0],
    dropoff: projectedRoute[projectedRoute.length - 1],
  };
}

export function RouteMap({ pickup, dropoff, routeGeometry, distanceMiles, durationMinutes, loading = false }: RouteMapProps) {
  const usablePickup = hasCoordinates(pickup);
  const usableDropoff = hasCoordinates(dropoff);
  const geometry = usablePickup && usableDropoff ? routeGeometry ?? fallbackGeometry(pickup, dropoff) : undefined;
  const tileMap = useMemo(() => buildTileMap(geometry), [geometry]);
  const routeLabel = usablePickup && usableDropoff ? `${shortAddress(pickup)} to ${shortAddress(dropoff)}` : "Waiting for pickup and drop-off";

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div>
          <h2 className="text-base font-extrabold text-slate-950">Route map</h2>
          <p className="mt-0.5 text-sm text-slate-500">{routeLabel}</p>
        </div>
        <div className="shrink-0 rounded-full bg-primary-50 px-3 py-1 text-xs font-extrabold text-primary-700 ring-1 ring-primary-100">
          {loading ? "Routing..." : distanceMiles ? `${distanceMiles.toFixed(1)} mi` : "Route"}
        </div>
      </div>

      <div
        className="relative h-56 overflow-hidden bg-slate-100"
        aria-label="Map showing route between pickup and drop-off"
        role="img"
      >
        {tileMap ? (
          <>
            {tileMap.tiles.map((tile) => (
              <img
                key={tile.key}
                src={tile.src}
                alt=""
                className="absolute select-none"
                draggable={false}
                style={{
                  left: `${(tile.left / MAP_WIDTH) * 100}%`,
                  top: `${(tile.top / MAP_HEIGHT) * 100}%`,
                  width: `${(TILE_SIZE / MAP_WIDTH) * 100}%`,
                  height: `${(TILE_SIZE / MAP_HEIGHT) * 100}%`,
                }}
              />
            ))}

            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} aria-hidden="true">
              <path
                d={tileMap.routePath}
                fill="none"
                stroke="#120A00"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity="0.22"
                strokeWidth="10"
              />
              <path
                d={tileMap.routePath}
                fill="none"
                stroke="#F59E0B"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="5"
              />
            </svg>

            <div
              className="pointer-events-none absolute z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950 text-sm font-extrabold text-white shadow-xl ring-4 ring-white"
              style={{ left: `${(tileMap.pickup.x / MAP_WIDTH) * 100}%`, top: `${(tileMap.pickup.y / MAP_HEIGHT) * 100}%` }}
            >
              A
            </div>
            <div
              className="pointer-events-none absolute z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary-400 text-sm font-extrabold text-white shadow-xl ring-4 ring-white"
              style={{ left: `${(tileMap.dropoff.x / MAP_WIDTH) * 100}%`, top: `${(tileMap.dropoff.y / MAP_HEIGHT) * 100}%` }}
            >
              B
            </div>

            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-2 right-2 rounded bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-600 shadow-sm"
            >
              OpenStreetMap
            </a>
          </>
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center">
            <div>
              <p className="text-sm font-bold text-stone-950">Map loading</p>
              <p className="mt-1 text-sm text-slate-600">Confirm both addresses to show the route map.</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/55 backdrop-blur-[1px]">
            <div className="rounded-full bg-slate-950 px-4 py-2 text-sm font-extrabold text-white shadow-lg">Calculating route...</div>
          </div>
        ) : null}
      </div>

      <div className="grid gap-3 border-t border-slate-100 p-4 sm:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">Pickup</p>
          <p className="mt-1 truncate text-sm font-bold text-slate-950">{shortAddress(pickup)}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">Drop-off</p>
          <p className="mt-1 truncate text-sm font-bold text-slate-950">{shortAddress(dropoff)}</p>
        </div>
        <div className="rounded-xl bg-slate-950 p-3 text-white">
          <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">Drive</p>
          <p className="mt-1 truncate text-sm font-extrabold">
            {distanceMiles ? `${distanceMiles.toFixed(1)} miles` : "Waiting for route"}
            {durationMinutes ? ` / ${Math.round(durationMinutes)} min` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
