// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";
// import { VitePWA } from "vite-plugin-pwa";

// export default defineConfig({
//   plugins: [
//     tailwindcss(),
//     react(),
//     VitePWA({
//       registerType: "autoUpdate",
//       includeAssets: ["favicon.svg", "robots.txt", "apple-touch-icon.png"],
//       manifest: {
//         name: "BandhanHub",
//         short_name: "BandhanHub",
//         description: "Community & chat app",
//         theme_color: "#ec4899",
//         background_color: "#ffffff",
//         display: "standalone",
//         icons: [
//           {
//             src: "iconnii.png",
//             sizes: "192x192",
//             type: "image/png",
//           },
//           {
//             src: "iconne.png",
//             sizes: "512x512",
//             type: "image/png",
//           },
//         ],
//       },
//     }),
//   ],
// });











// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";
// import { VitePWA } from "vite-plugin-pwa";

// export default defineConfig({
//   plugins: [
//     tailwindcss(),
//     react(),
//     VitePWA({
//       registerType: "autoUpdate", // updates SW automatically
//       devOptions: {
//         enabled: true, // allows testing PWA in dev mode
//       },
//       includeAssets: [
//         "favicon.svg",
//         "robots.txt",
//         "apple-touch-icon.png"
//       ],
//       manifest: {
//         name: "BandhanHub",
//         short_name: "BandhanHub",
//         description: "Community & chat app",
//         theme_color: "#ec4899",
//         background_color: "#ffffff",
//         display: "standalone",
//         orientation: "portrait",
//         start_url: "/",
//         icons: [
//           {
//             src: "/iconnii.png",
//             sizes: "192x192",
//             type: "image/png",
//           },
//           {
//             src: "/iconne.png",
//             sizes: "512x512",
//             type: "image/png",
//           },
//           {
//             src: "/iconne.png",
//             sizes: "512x512",
//             type: "image/png",
//             purpose: "maskable any"
//           }
//         ],
//       },
//     }),
//   ],
// });





// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";
// import { VitePWA } from "vite-plugin-pwa";

// export default defineConfig({
//   plugins: [
//     tailwindcss(),
//     react(),
//     VitePWA({
//       registerType: "autoUpdate", // updates SW automatically
//       devOptions: {
//         enabled: true, // allows testing PWA in dev mode
//       },
//       includeAssets: [
//         "favicon.svg",
//         "robots.txt",
//         "apple-touch-icon.png"
//       ],
//       manifest: {
//         name: "BandhanHub",
//         short_name: "BandhanHub",
//         description: "Community & chat app",
//         theme_color: "#ec4899",
//         background_color: "#ffffff",
//         display: "standalone",
//         orientation: "portrait",
//         start_url: "/",
//         icons: [
//           {
//             src: "/iconnii.png",
//             sizes: "192x192",
//             type: "image/png",
//           },
//           {
//             src: "/iconne.png",
//             sizes: "512x512",
//             type: "image/png",
//           },
//           {
//             src: "/iconne.png",
//             sizes: "512x512",
//             type: "image/png",
//             purpose: "maskable any"
//           }
//         ],
//       },
//     }),
//   ],
// });










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
      devOptions: {
        enabled: true, // allow testing in dev
      },
      includeAssets: [
        "favicon.svg",
        "robots.txt",
        "apple-touch-icon.png"
      ],
      manifest: {
        name: "BandhanHub",
        short_name: "BandhanHub",
        description: "Community & chat app",
        theme_color: "#ec4899",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        icons: [
          {
            src: "/iconnii.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/iconne.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/iconne.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
