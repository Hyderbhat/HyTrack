const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const API_ORIGIN = new URL(API_URL).origin;

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
