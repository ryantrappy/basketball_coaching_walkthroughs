import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({ plugins: [react(),VitePWA({
 registerType:'prompt',
 includeAssets:['icons/court.svg'],
 manifest:{name:'Second Read — Basketball Playbook',short_name:'Second Read',description:'Basketball spacing, timing, and reads. Your offline film room.',theme_color:'#183f36',background_color:'#f7f6f0',display:'standalone',start_url:'./',scope:'./',icons:[{src:'icons/icon-192.png',sizes:'192x192',type:'image/png'},{src:'icons/icon-512.png',sizes:'512x512',type:'image/png'},{src:'icons/court.svg',sizes:'any',type:'image/svg+xml',purpose:'any'}]},
 workbox:{clientsClaim:true,globPatterns:['**/*.{js,css,html,woff,woff2,png,svg,webmanifest}'],cleanupOutdatedCaches:true,navigateFallback:'index.html',navigateFallbackDenylist:[/^\/healthz$/]},
 })], base: './' });
