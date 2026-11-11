import { defineConfig } from 'vite';
export default defineConfig({server:{host:'0.0.0.0',allowedHosts:true,headers:{'Cache-Control':'no-store, max-age=0'}}});
