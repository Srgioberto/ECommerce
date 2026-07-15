const BACKEND_ORIGIN = "http://localhost:3000";

// Newly uploaded product photos are optimized and served by the backend
// under /uploads/... . Older/seed products just reference a filename that
// ships as a static asset inside Frontend/public/img/products.
export const getProductImageUrl = (image) => {
  if (!image) return "../img/products/default.png";
  if (image.startsWith("/uploads/")) return `${BACKEND_ORIGIN}${image}`;
  return `../img/products/${image}`;
};

// A product may have no sizes defined yet (legacy data, or the admin left
// it blank) - always work with an array so callers don't have to guard.
export const getProductSizes = (product) =>
  Array.isArray(product?.sizes) ? product.sizes : [];
