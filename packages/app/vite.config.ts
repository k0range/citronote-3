import { defineConfig } from "vite";
import type { UserConfig, ConfigEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from 'vite-plugin-pwa'
import pkg from "../../package.json";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const appEnv =
    mode.split("-")[0] === "browser"
      ? "browser"
      : mode.split("-")[0] === "electron"
        ? "electron"
        : "browser";

  return {
    base: "./",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    build: {
      target: "esnext",
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, "index.html"),
          notebookSelector: path.resolve(__dirname, "index.html"),
        }
      }
    },
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'], // what mask icon?
        manifest: {
          name: "Citronote Web",
          short_name: "Citronote",
          description: "A high-feat notes app ",
          
          theme_color: "#181818",
          background_color: "#181818",
          display: "standalone",
          scope: "/",
          start_url: "/",
          icons: [
            {
              src: "icon_x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "maskable_icon_x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
        devOptions: {
          enabled: false
        }
      })
    ],
    define: {
      __APP_PLATFORM__: JSON.stringify(appEnv),
      __APP_IS_PORTABLE__: mode === "electron-portable",
      __APP_VERSION__: JSON.stringify(pkg.version),
    },
  };
});
