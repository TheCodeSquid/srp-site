import { defineConfig } from "vite";
import solid from "vite-plugin-solid"

export default defineConfig({
  plugins: [solid()],
  base: "https://thecodesquid.github.io/srp-site"
});
