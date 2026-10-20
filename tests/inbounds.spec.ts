import type { Locator } from '@playwright/test';
import { test, expect } from '@playwright/test';

const lessons=[
 ['box-cross','Box cross-screen','baseline'],['box-sts','Box screen-the-screener','baseline'],['stack-release','Baseline stack releases','baseline'],['inbound-return','Inbounder give-and-go','baseline'],
 ['sideline-zipper','Sideline zipper entry','sideline'],['sideline-slip','Sideline screen & slip','sideline'],
];
const position = async (locator: Locator): Promise<number[]> => {
 const transform=await locator.getAttribute('transform');
 const coordinates=transform?.match(/-?\d+(?:\.\d+)?/g);
 if(!coordinates)throw new Error('Player is missing coordinates');
 return coordinates.map(Number);
};

test('six inbounds plays show an outside thrower, a safety, and four complete steps',async({page})=>{
 const errors: string[]=[];page.on('pageerror',e=>errors.push(e.message));
 for(const [id,name,edge] of lessons){
  await page.goto(`/#inbounds/${id}`);
  await expect(page.getByRole('heading',{name,exact:true})).toBeVisible();
  await expect(page.getByRole('navigation',{name:'Basketball concepts'}).locator('.concept-option')).toHaveCount(6);
  await expect(page.locator('.inbound-setup')).toContainText('Safety outletPlayer 3');
  const outside=await position(page.locator('.player').first());
  expect(outside[edge==='baseline'?1:0]).toBeLessThan(0);
  await expect(page.locator('.throw-in-spot')).toContainText('1 · inbounder');
  for(let i=0;i<4;i++){
   await page.locator('.step').nth(i).click();
   await expect(page.getByRole('img',{name:/step [1-4]/})).toHaveAttribute('aria-label',new RegExp(`step ${i+1}`));
  }
  const inside=await position(page.locator('.player').first());
  expect(inside[0]).toBeGreaterThan(25);expect(inside[1]).toBeGreaterThan(25);
  await expect(page.locator('.read-choice')).toHaveCount(3);
  await expect(page.locator('.read-choice').last()).toContainText('safety');
  await page.locator('.read-choice').last().click();
  await expect(page.locator('.read-route.muted-route')).toHaveCount(2);
  await expect(page.locator('.read-condition')).not.toBeEmpty();
  expect(await page.locator('.read-route').evaluateAll(items=>items.every(item=>item.getAttribute('d')!==null&&!item.getAttribute('d')!.includes('NaN')))).toBe(true);
 }
 expect(errors).toEqual([]);
});

test('section navigation, baseline and sideline groups, memory and direct links',async({page})=>{
 await page.goto('/#short-roll');
 await page.getByRole('navigation',{name:'Playbook views'}).getByRole('link',{name:/Inbounds/}).click();
 await expect(page).toHaveURL(/#inbounds\/box-cross/);
 await expect(page.getByRole('button',{name:'Baseline (BLOB)',exact:true})).toHaveAttribute('aria-expanded','true');
 await expect(page.locator('.concept-option:visible')).toHaveCount(4);
 await page.getByRole('button',{name:'Sideline (SLOB)',exact:true}).click();
 await expect(page.locator('.concept-option:visible')).toHaveCount(2);
 await page.getByRole('navigation',{name:'Basketball concepts'}).getByRole('button',{name:/Sideline zipper entry/}).click();
 await expect(page.getByRole('button',{name:'Sideline (SLOB)',exact:true})).toHaveAttribute('aria-expanded','true');
 await page.getByRole('navigation',{name:'Playbook views'}).getByRole('link',{name:/Offense/}).click();
 await expect(page.getByRole('heading',{name:'Short roll',exact:true})).toBeVisible();
 await page.getByRole('navigation',{name:'Playbook views'}).getByRole('link',{name:/Inbounds/}).click();
 await expect(page.getByRole('heading',{name:'Sideline zipper entry',exact:true})).toBeVisible();
 await page.reload();
 await expect(page.getByRole('heading',{name:'Sideline zipper entry',exact:true})).toBeVisible();
 await page.locator('.connections').getByRole('button',{name:/Switching ball screens/}).click();
 await expect(page.getByRole('navigation',{name:'Playbook views'}).getByRole('link',{name:/Defense/})).toHaveAttribute('aria-current','page');
 await page.goBack();
 await expect(page.getByRole('heading',{name:'Sideline zipper entry',exact:true})).toBeVisible();
 await page.goto('/#inbounds');
 await expect(page.getByRole('heading',{name:'Box cross-screen',exact:true})).toBeVisible();
});

test('entry reads stay anchored outside; give-and-go distinguishes the second pass',async({page})=>{
 await page.goto('/#inbounds/box-cross');
 await page.locator('.step').nth(3).click();
 // The final-frame overlay revisits the throw-in, even after player 1 has entered.
 const origin=(await page.locator('.read-route').first().getAttribute('d'))!.match(/-?\d+(?:\.\d+)?/g)!.slice(0,2).map(Number);
 expect(origin[1]).toBeLessThan(25);
 await page.goto('/#inbounds/inbound-return');
 await page.locator('.step').nth(2).click();
 await expect(page.locator('.read-options-heading')).toContainText('2’s options');
 await expect(page.locator('.read-options-heading')).toContainText('After the entry catch');
 await page.getByRole('button',{name:/Return to the inbounder/}).click();
 await expect(page.locator('.read-condition')).toContainText('After the initial entry');
 await page.getByRole('button',{name:'Expand diagram'}).click();
 await expect(page.getByRole('dialog',{name:'Expanded playboard'})).toBeVisible();
 await page.keyboard.press('Escape');
 await page.goto('/#inbounds/box-cross');
 await page.locator('.step').nth(2).click();
 await page.screenshot({path:'/tmp/second-read-inbounds-desktop.png',fullPage:true});
 for(const width of [320,390,768]){
  await page.setViewportSize({width,height:844});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await expect(page.getByRole('navigation',{name:'Playbook views'}).getByRole('link',{name:/Inbounds/})).toBeVisible();
 }
 await page.setViewportSize({width:390,height:844});
 await page.goto('/#inbounds/sideline-zipper');
 await page.locator('.step').nth(2).click();
 await page.getByRole('button',{name:/Use the far-side safety/}).click();
 await page.screenshot({path:'/tmp/second-read-inbounds-mobile.png',fullPage:true});
});
