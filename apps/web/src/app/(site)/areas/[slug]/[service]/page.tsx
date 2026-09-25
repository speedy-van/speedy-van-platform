import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAreaBySlug } from "@/lib/areas";
import { SERVICES } from "@/lib/services";
import { LOCAL_SERVICE_PAGES } from "@/lib/content/city-service-pages";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { MovingContentPage } from "@/components/areas/MovingContentPage";
import { relatedLocalServiceLinks } from "@/lib/seo/local-service-links";
import { getAreaGuide } from "@/lib/area-guides";

interface Props { params: Promise<{ slug: string; service: string }> }
export const dynamicParams = false;

// Return both segments: the sibling area page is not an ancestor generator.
export function generateStaticParams() {
  return LOCAL_SERVICE_PAGES.map((page) => ({ slug: page.areaSlug, service: page.serviceSlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, service } = await params;
  const page = LOCAL_SERVICE_PAGES.find((entry) => entry.areaSlug === slug && entry.serviceSlug === service);
  if (!page) notFound();
  return buildPageMetadata({ title: page.title, description: page.description, path: `/areas/${slug}/${service}` });
}

export default async function LocalServicePage({ params }: Props) {
  const { slug, service } = await params;
  const area = getAreaBySlug(slug);
  const serviceData = SERVICES.find((entry) => entry.slug === service && entry.indexable !== false);
  const page = LOCAL_SERVICE_PAGES.find((entry) => entry.areaSlug === slug && entry.serviceSlug === service);
  if (!area || !serviceData || !page) notFound();
  const path = `/areas/${slug}/${service}`;
  return <MovingContentPage {...page} path={path} origin={area} serviceSlug={service} breadcrumbs={[
    { name: "Home", url: "/" }, { name: "Areas", url: "/areas" },
    { name: area.name, url: `/areas/${slug}` }, { name: serviceData.name, url: path },
  ]} related={[
    { name: `${area.name} moving guide`, href: `/areas/${slug}` },
    { name: serviceData.name, href: `/services/${service}` },
    { name: "Moving price guide", href: getAreaGuide(slug) ? `/pricing#${slug}` : "/pricing" },
    ...relatedLocalServiceLinks(slug, service),
  ]} />;
}
