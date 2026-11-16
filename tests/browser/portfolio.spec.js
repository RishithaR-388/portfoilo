import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('navigation, commands, history, safe input, and project details',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');
 await expect(page.locator('h1')).toHaveText('Rishitha.');
 const input=page.locator('#command-input');await expect(input).toBeVisible();await expect(input).not.toBeFocused();
 await input.fill('pr');await input.press('Alt+ArrowRight');expect(await input.inputValue()).toBe('projects');
 await input.fill('project recommendations');await input.press('Enter');await expect(page).toHaveURL(/#project-recommendations$/);await expect(page.locator('#project-recommendations details')).toHaveAttribute('open','');
 await input.fill('projects');await input.press('Enter');await input.fill('projects');await input.press('Enter');expect(await page.locator('#projects').count()).toBe(1);
 await input.fill('Unfinished draft');await input.press('ArrowUp');expect(await input.inputValue()).toBe('projects');await input.press('ArrowDown');expect(await input.inputValue()).toBe('Unfinished draft');
 await input.fill('<img src=x onerror=alert(1)>');await input.press('Enter');await expect(page.locator('#transcript img')).toHaveCount(0);
 await input.fill('help');await input.press('Enter');await expect(page.locator('#transcript')).toContainText('does not execute shell commands');
 await input.fill('history');await input.press('Enter');await expect(page.locator('#transcript')).toContainText('project recommendations');
 await input.fill('clear');await input.press('Enter');await expect(page.locator('.command-entry')).toHaveCount(0);await expect(page.locator('#projects')).toBeVisible();
 await page.locator('nav a[href="#skills"]').click();await expect(page).toHaveURL(/#skills$/);await page.goBack();await expect(page).toHaveURL(/#projects$/);
 await page.locator('nav a[href="#contact"]').click();await expect(input).not.toBeFocused();expect(errors).toEqual([]);
});

test('all commands resolve and themes persist',async({page})=>{
 await page.goto('/');const input=page.locator('#command-input');
 for(const command of ['about','whoami','experience','projects','project deepweeds','skills','education','resume','contact','links','email','github','linkedin','leetcode','banner','theme ls','theme set paper']){
  await input.fill(command);await input.press('Enter');await expect(page.locator('.command-entry').last()).not.toContainText('Command not found');
 }
 await expect(page.locator('html')).toHaveAttribute('data-theme','paper');await page.reload();await expect(page.locator('#theme-select')).toHaveValue('paper');
 await input.fill('theme system');await input.press('Enter');await expect(page.locator('#theme-select')).toHaveValue('system');
 await page.goto('/#not-a-section');await expect(page.locator('h1')).toBeVisible();
});

test('accessible and responsive in both themes',async({page},testInfo)=>{
 await page.goto('/');
 for(const theme of ['graphite','paper']){
  await page.locator('#theme-select').selectOption(theme);
  for(const width of [320,375,768,1024,1440]){
   await page.setViewportSize({width,height:1000});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   if(width===375||width===1440)await page.screenshot({path:testInfo.outputPath(`${theme}-${width}.png`),fullPage:true});
  }
  const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();expect(results.violations).toEqual([]);
 }
 await page.setViewportSize({width:812,height:375});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('no-script content and résumé request',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();await page.goto('/');
 await expect(page.locator('#experience')).toContainText('Visa');await expect(page.locator('#projects')).toContainText('Recommendation System');await expect(page.locator('.terminal-zone')).toBeHidden();
 await expect(page.locator('.resume-actions a')).toHaveAttribute('href',/^mailto:/);await expect(page.locator('.resume-inline')).toContainText('Request résumé');await context.close();
});

test('GitHub failure and retry, safe description, clipboard fallback',async({page})=>{
 let attempts=0;await page.route('https://api.github.com/**',route=>{attempts++;return route.fulfill(attempts===1?{status:403,body:'{}'}:{json:[{name:'Example',html_url:'https://github.com/test/repo',description:'<img src=x onerror=alert(1)>'}]});});
 await page.goto('/');await page.locator('.github-extra summary').click();await expect(page.locator('#github-repos')).toContainText('limiting');await page.getByRole('button',{name:'Try again'}).click();await expect(page.locator('#github-repos')).toContainText('<img');await expect(page.locator('#github-repos img')).toHaveCount(0);
 await page.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(Error('blocked'))},configurable:true});});await page.locator('#copy-email').click();await expect(page.locator('#live-status')).toContainText('Clipboard unavailable');
});

test('keyboard flow, blocked storage, reduced motion, and direct project route',async({page,browserName})=>{
 await page.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw Error('blocked');}});});
 await page.goto('/#project-deepweeds');await expect(page.locator('#project-deepweeds details')).toHaveAttribute('open','');await page.locator('#theme-select').selectOption('paper');await expect(page.locator('html')).toHaveAttribute('data-theme','paper');
 const input=page.locator('#command-input');await input.focus();await input.fill('pro');await input.press(browserName==='webkit'?'Alt+Tab':'Tab');await expect(page.locator('.execute')).toBeFocused();await input.focus();await input.press('Escape');await expect(page.locator('#suggestions')).toBeHidden();
 await page.goto('/');await page.keyboard.press(browserName==='webkit'?'Alt+Tab':'Tab');await expect(page.locator('.skip-link')).toBeFocused();await page.keyboard.press('Enter');await expect(page.locator('#main')).toBeFocused();expect(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
});

test('touch navigation, invalid stored theme, copy success, and composition',async({browser})=>{
 const context=await browser.newContext({viewport:{width:375,height:812},hasTouch:true,isMobile:true,reducedMotion:'reduce'});
 await context.addInitScript(()=>{localStorage.setItem('rishitha-theme','invalid');Object.defineProperty(navigator,'clipboard',{value:{writeText:async value=>{window.copiedValue=value;}},configurable:true});});
 const page=await context.newPage();await page.goto('/');await expect(page.locator('#theme-select')).toHaveValue('system');await page.locator('nav a[href="#projects"]').tap();await expect(page).toHaveURL(/#projects$/);
 await page.locator('#copy-email').tap();expect(await page.evaluate(()=>window.copiedValue)).toBe('rishitha4005@gmail.com');
 const input=page.locator('#command-input');await input.fill('about');await input.dispatchEvent('compositionstart');await input.press('Enter');await expect(page.locator('.command-entry')).toHaveCount(0);await input.dispatchEvent('compositionend');await input.press('Enter');await expect(page.locator('.command-entry')).toHaveCount(1);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await context.close();
});

test('omitted PDF produces useful contact fallback',async({page})=>{
 await page.goto('/');await expect(page.locator('#resume')).toContainText('available on request');await expect(page.locator('a[href$=".pdf"]')).toHaveCount(0);const input=page.locator('#command-input');await input.fill('resume');await input.press('Enter');await expect(page.locator('.command-entry').last()).toContainText('Please email me');
});
