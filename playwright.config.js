import {defineConfig} from '@playwright/test';
export default defineConfig({
 testDir:'./tests/browser',fullyParallel:false,workers:1,timeout:30000,
 use:{baseURL:process.env.PORTFOLIO_URL||'http://127.0.0.1:4030',headless:true,reducedMotion:'reduce',viewport:{width:1440,height:1000}},
 projects:[{name:'chromium',use:{browserName:'chromium',channel:'chrome'}},{name:'webkit',use:{browserName:'webkit'}}],
 reporter:[['list']],
});
