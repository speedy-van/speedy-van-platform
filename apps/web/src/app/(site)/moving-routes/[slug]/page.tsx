import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAreaBySlug } from "@/lib/areas";
import { MOVING_ROUTE_PAGES } from "@/lib/content/moving-route-pages";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { MovingContentPage } from "@/components/areas/MovingContentPage";

interface Props { params: Promise<{ slug: string }> }
export const dynamicParams = false;
export function generateStaticParams() { return MOVING_ROUTE_PAGES.map((page) => ({ slug: page.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = MOVING_ROUTE_PAGES.find((entry) => entry.slug === slug);
  if (!page) notFound();
  return buildPageMetadata({ title: page.title, description: page.description, path: `/moving-routes/${slug}` });
}
export default async function MovingRoutePage({ params }: Props) {
  const { slug } = await params;
  const page = MOVING_ROUTE_PAGES.find((entry) => entry.slug === slug);
  if (!page) notFound();
  const origin = getAreaBySlug(page.originSlug);
  if (!origin) notFound();
  const path = `/moving-routes/${slug}`;
  return <MovingContentPage {...page} path={path} origin={origin} breadcrumbs={[
    { name: "Home", url: "/" }, { name: "Routes from Scotland", url: "/moving-routes" },
    { name: `${origin.name} to ${page.destination}`, url: path },
  ]} related={[
    { name: `${origin.name} moving guide`, href: `/areas/${origin.slug}` },
    { name: "Routes from Scotland", href: "/moving-routes" },
    { name: "Long-distance removals", href: "/services/long-distance-removals" },
    ...MOVING_ROUTE_PAGES.filter((entry) => entry.originSlug === origin.slug && entry.slug !== slug).slice(0, 3).map((entry) => ({ name: `${origin.name} to ${entry.destination}`, href: `/moving-routes/${entry.slug}` })),
  ]} />;
}
