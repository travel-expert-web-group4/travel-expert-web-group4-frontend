import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  define: {
    global: {}, // ✅ This fixes sockjs-client error in browser
  },
  server: {
    port: 5173, // ✅ Fixed dev port
    proxy: {
      '/api': 'http://localhost:8080',
      '/chat': {
        target: 'http://localhost:8080',
        ws: true,             // ✅ Enable WebSocket proxying
        changeOrigin: true, 
        secure:false  // ✅ Adjust origin header for backend
      }
    },
    // 👇 Fix for refreshing or visiting /chat directly
    fs: {
      strict: false
    },
    historyApiFallback: true
  }
});
