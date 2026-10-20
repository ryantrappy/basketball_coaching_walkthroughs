import { defineConfig } from '@playwright/test';

export default defineConfig({
 testDir:'./server-tests',
 use:{baseURL:'http://127.0.0.1:5180',browserName:'chromium',channel:process.env.PLAYWRIGHT_CHANNEL || undefined},
 webServer:{command:'npm start',url:'http://127.0.0.1:5180/healthz',env:{PORT:'5180'},reuseExistingServer:false},
});
