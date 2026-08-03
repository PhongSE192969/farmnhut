import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const useMockApi = env.VITE_USE_MOCK_API !== "false";

  return {
    define: {
      global: "window",
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    server: {
      host: "127.0.0.1",
      port: 5173,
      strictPort: true,
      proxy: useMockApi
        ? undefined
        : {
            "/api": {
              target: env.VITE_BASE_URL || "http://localhost:3000",
              changeOrigin: true,
              secure: false,
              ws: true,
            },
          },
    },
  };
});
