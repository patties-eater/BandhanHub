import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "BandhanHub",
        short_name: "BandhanHub",
        description: "Community & chat app",
        theme_color: "#ec4899",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "iconnii.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "iconne.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
