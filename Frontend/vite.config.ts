import { defineConfig } from "vite";
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import react from "@vitejs/plugin-react";
import dotenv from 'dotenv'

dotenv.config()
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(),
  ],
  define:{
    'process.env.SOCKET_URL': JSON.stringify(process.env.VITE_SOCKET_URL),
  },
  base: '/'
});
