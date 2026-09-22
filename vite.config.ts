import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Determine base path:
  // 1. Explicit VITE_BASE_PATH or BASE_PATH from environment
  // 2. Netlify environment (NETLIFY=true) -> '/'
  // 3. GitHub Actions environment (GITHUB_ACTIONS=true) -> '/PropCareAi/'
  // 4. Default for local development / other hosts -> '/'
  let base = '/';

  if (env.VITE_BASE_PATH) {
    base = env.VITE_BASE_PATH;
  } else if (process.env.VITE_BASE_PATH) {
    base = process.env.VITE_BASE_PATH;
  } else if (process.env.BASE_PATH) {
    base = process.env.BASE_PATH;
  } else if (process.env.NETLIFY === 'true' || env.NETLIFY === 'true') {
    base = '/';
  } else if (process.env.GITHUB_ACTIONS === 'true' || process.env.GITHUB_PAGES === 'true') {
    base = '/PropCareAi/';
  }

  // Ensure trailing slash for subdirectory base paths
  if (base !== '/' && !base.endsWith('/')) {
    base = `${base}/`;
  }

  return {
    base,
    plugins: [react()],
    server: {
      port: 5173,
      host: true
    }
  };
});


