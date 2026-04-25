export const SERVICE_IMAGES: Record<string, string> = {
  "man-and-van":        "/images/services/man-and-van.jpg",
  "house-removal":      "/images/services/house-removal.jpg",
  "office-removal":     "/images/services/office-removal.jpg",
  "student-move":       "/images/services/student-move.jpg",
  "furniture-delivery": "/images/services/furniture-delivery.jpg",
  "ikea-delivery":      "/images/services/ikea-delivery.jpg",
  "rubbish-removal":    "/images/services/rubbish-removal.jpg",
  "piano-moving":       "/images/services/piano-moving.jpg",
  "same-day-delivery":  "/images/services/same-day-delivery.jpg",
  "packing-service":    "/images/services/packing-service.jpg",
};

export function getServiceImage(slug: string): string {
  return SERVICE_IMAGES[slug] ?? "/images/services/man-and-van.jpg";
}
