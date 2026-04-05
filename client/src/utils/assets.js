const API_URL = import.meta.env.VITE_API_URL || "https://hytrack.onrender.com";
let API_ORIGIN;

try {
  API_ORIGIN = new URL(API_URL).origin;
} catch {
  API_ORIGIN = "https://hytrack.onrender.com";
}

export function resolveAssetUrl(url) {
  if (!url) return "";

  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:")
  ) {
    return url;
  }

  return `${API_ORIGIN}/${url.replace(/^\/+/, "")}`;
}

export function resolveAssetUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  if (url.startsWith('/')) {
    return `${API_ORIGIN}${url}`;
  }
  return `${API_ORIGIN}/${url}`;
}
