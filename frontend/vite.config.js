import { defineConfig } from "vite";
<<<<<<< HEAD
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl(), tailwindcss()],
=======
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
>>>>>>> 237ce72a27ab12616fd2bf65c8ebaee74f3281bb
});
