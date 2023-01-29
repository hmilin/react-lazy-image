import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  resolve: {
    alias: [
      {
        find: "react-lazy-image",
        replacement: "dist/index",
      },
    ],
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.tsx"),
      name: "ReactLazyImage",
      fileName: "index",
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: ["react", "typescript"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
