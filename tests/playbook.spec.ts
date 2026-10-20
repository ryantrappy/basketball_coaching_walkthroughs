import { test, expect } from '@playwright/test';
import { selectLesson } from './helpers';

test('playback, scrubbing, toggles, counters and related navigation', async ({ page }) => {
 const errors: string[]=[]; page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 await expect(page.getByRole('heading',{name:'Pick & pop',exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'Previous step',exact:true})).toBeDisabled();
 await page.getByRole('button',{name:'Next step',exact:true}).click();
 await expect(page.getByRole('img', {name:/step [1-4]/})).toHaveAttribute('aria-label',/step 2/);
 await page.getByRole('button',{name:'Play animation',exact:true}).click();
 await expect(page.getByRole('button',{name:'Pause animation',exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'Play animation',exact:true})).toBeVisible({timeout:10000});
 await expect(page.getByRole('img', {name:/step [1-4]/})).toHaveAttribute('aria-label',/step 4/);
 await expect(page.getByRole('button',{name:'Next step',exact:true})).toBeDisabled();
 await page.getByRole('button',{name:'Reset animation'}).click();
 await page.getByRole('combobox',{name:'Playback speed'}).selectOption('0.25');
 await expect(page.getByRole('combobox',{name:'Playback speed'})).toHaveValue('0.25');
 await page.getByRole('slider',{name:'Animation position'}).fill('1.5');
 await expect(page.getByRole('slider')).toHaveValue('1.5');
 await page.getByRole('checkbox',{name:'Show defense'}).uncheck();
 await expect(page.locator('.defender')).toHaveCount(0);
 await page.getByRole('checkbox',{name:'Show defense'}).check();
 await expect(page.locator('.defender')).toHaveCount(5);
 await page.getByText('Drop',{exact:true}).click();
 await expect(page.locator('details[open]')).toContainText('outside hip');
 await page.locator('.connections').getByRole('button',{name:'Short roll',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Short roll',exact:true})).toBeVisible();
 await expect(page).toHaveURL(/#short-roll/);
 await page.reload();
 await expect(page.getByRole('heading',{name:'Short roll',exact:true})).toBeVisible();
 expect(errors).toEqual([]);
});

test('every concept has four steps and resets its playback', async ({page})=>{
 await page.goto('/');
 for(const name of ['Pick & pop','Pick & roll','Short roll','Spain pick & roll','Drive & kick spacing','Dribble handoff']){
  await selectLesson(page,name);
  await expect(page.getByRole('heading',{name,exact:true})).toBeVisible();
  await expect(page.getByRole('img', {name:/step [1-4]/})).toHaveAttribute('aria-label',/step 1/);
  await expect(page.locator('.step')).toHaveCount(4);
  await page.locator('.step').nth(3).click();
  await expect(page.getByRole('img', {name:/step [1-4]/})).toHaveAttribute('aria-label',/step 4/);
 }
});

test('mobile layout, expanded board and help keyboard access', async ({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByRole('button',{name:'Expand diagram'}).click();
 await expect(page.getByRole('dialog',{name:'Expanded playboard'})).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(page.getByRole('dialog')).toHaveCount(0);
 await page.getByRole('button',{name:'Open playbook guide'}).click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await page.keyboard.press('Shift+Tab');
 await expect(page.getByRole('button',{name:'Back to the court'})).toBeFocused();
 await page.keyboard.press('Escape');
 await expect(page.getByRole('button',{name:'Open playbook guide'})).toBeFocused();
 await page.screenshot({path:'/tmp/second-read-mobile.png',fullPage:true});
 await page.setViewportSize({width:1440,height:1100});
 await page.screenshot({path:'/tmp/second-read-desktop.png',fullPage:true});
});

test('conditional ball routes stay visible at the decision and final frames', async ({page})=>{
 const errors: string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/#spain');
 await expect(page.locator('.read-route')).toHaveCount(0);
 await page.locator('.step').nth(2).click();
 await expect(page.locator('.read-route')).toHaveCount(3);
 await expect(page.getByRole('button',{name:/Hit the roller/})).toBeVisible();
 await page.getByRole('button',{name:/Hit the roller/}).click();
 await expect(page.getByRole('button',{name:/Hit the roller/})).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('.read-route.muted-route')).toHaveCount(2);
 await expect(page.locator('.read-condition')).toContainText('back screen delays x5');
 await page.getByRole('button',{name:'Show all',exact:true}).click();
 await expect(page.locator('.read-route.muted-route')).toHaveCount(0);
 await page.locator('.step').nth(3).click();
 await expect(page.locator('.read-route')).toHaveCount(3);
 await page.getByRole('checkbox',{name:'Movement paths'}).uncheck();
 await expect(page.locator('.read-route')).toHaveCount(3);
 await page.getByRole('checkbox',{name:'Passing reads',exact:true}).uncheck();
 await expect(page.locator('.read-route')).toHaveCount(0);
 await page.getByRole('checkbox',{name:'Passing reads',exact:true}).check();
 await selectLesson(page,'Short roll');
 await page.locator('.step').nth(2).click();
 await expect(page.locator('.read-options-heading')).toContainText('5’s options');
 await page.getByRole('button',{name:/Keep it to the rim/}).click();
 await expect(page.locator('.read-condition')).toContainText('attack the open lane');
 await page.setViewportSize({width:390,height:844});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:'/tmp/second-read-reads-mobile.png',fullPage:true});
 await page.setViewportSize({width:1440,height:1100});
 await page.goto('/#spain');
 await page.locator('.step').nth(3).click();
 await page.screenshot({path:'/tmp/second-read-reads-desktop.png',fullPage:true});
 expect(errors).toEqual([]);
});
