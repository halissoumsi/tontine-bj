import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const plugins = [
  react(),
  tailwindcss(),
  jsxLocPlugin(),
  VitePWA({
    registerType: "autoUpdate",
    injectRegister: "auto",
    filename: "service-worker.js",
    includeAssets: ["icon.svg"],
    manifest: {
      name: "TontineBJ — La tontine, simplement",
      short_name: "TontineBJ",
      description: "La tontine numérique pensée au Bénin.",
      lang: "fr",
      start_url: "/",
      scope: "/",
      display: "standalone",
      background_color: "#f5f1e9",
      theme_color: "#1e5b47",
      icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any maskable" }],
    },
    workbox: {
      cleanupOutdatedCaches: true,
      navigateFallback: "/",
      runtimeCaching: [
        {
          urlPattern: ({ url }) => url.pathname.startsWith("/api/"),
          handler: "NetworkFirst",
          options: {
            cacheName: "tontinebj-api",
            networkTimeoutSeconds: 3,
            cacheableResponse: { statuses: [0, 200] },
            expiration: { maxEntries: 50, maxAgeSeconds: 300 },
          },
        },
        {
          urlPattern: ({ request }) => ["script", "style", "font"].includes(request.destination),
          handler: "CacheFirst",
          options: {
            cacheName: "tontinebj-static-assets",
            cacheableResponse: { statuses: [0, 200] },
            expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
          },
        },
        {
          urlPattern: ({ request }) => request.destination === "image",
          handler: "CacheFirst",
          options: {
            cacheName: "tontinebj-images",
            cacheableResponse: { statuses: [0, 200] },
            expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
          },
        },
      ],
    },
  }),
];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  base: "/",
  esbuild: {
    drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],
  },
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    assetsDir: "assets",
    manifest: true,
    sourcemap: false,
    target: "es2022",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
            return "vendor-react";
          }
          if (id.includes("node_modules/lucide-react") || id.includes("node_modules/framer-motion")) {
            return "vendor-ui";
          }
          if (id.includes("client/src/components/Map.tsx")) {
            return "component-map";
          }
        },
      },
    },
  },
  test: {
    root: path.resolve(import.meta.dirname),
    environment: "node",
    include: ["shared/**/*.test.ts", "server/**/*.test.ts", "client/**/*.test.ts"],
    exclude: ["node_modules", "dist"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["shared/**/*.ts", "server/**/*.ts"],
      exclude: ["**/*.d.ts", "**/*.test.ts"],
    },
  },
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    allowedHosts: ["localhost", "127.0.0.1"],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
