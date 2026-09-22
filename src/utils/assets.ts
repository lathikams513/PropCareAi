/**
 * Helper to resolve public assets correctly with Vite base path for GitHub Pages, Netlify, and local dev.
 */
export const getAssetUrl = (path: string): string => {
  if (!path) return path;
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }
  const base = import.meta.env.BASE_URL || '/';

  // If path already starts with the configured base (and base is not root '/'), return as is
  if (base !== '/' && path.startsWith(base)) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return base.endsWith('/') ? `${base}${cleanPath}` : `${base}/${cleanPath}`;
};

