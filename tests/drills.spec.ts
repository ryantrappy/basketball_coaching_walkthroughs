import { test, expect } from '@playwright/test';
import { drills } from '../src/drills';

test('Drills navigation groups practice by skill and goal, with bookmark and history support',async({page})=>{
 await page.goto('/#pick-pop');
 await page.getByRole('navigation',{name:'Playbook views'}).getByRole('link',{name:/Drills/}).click();
 await expect(page.getByRole('heading',{name:'Low-to-high pound',exact:true})).toBeVisible();
 await expect(page.getByRole('navigation',{name:'Playbook views'}).getByRole('link',{name:/Drills/})).toHaveAttribute('aria-current','page');
 await expect(page.locator('.drill-library .group-toggle')).toHaveCount(3);
 await page.getByRole('navigation',{name:'Drill goals'}).getByRole('button',{name:/Change pace/}).click();
 await page.getByRole('button',{name:'Retreat, cross & re-attack',exact:true}).click();
 await expect(page).toHaveURL(/#drills\/retreat/);
 await page.getByRole('group',{name:'Practice skill',exact:true}).getByRole('button',{name:'Shooting',exact:true}).click();
 await expect(page.getByRole('heading',{name:'One-hand touch ladder',exact:true})).toBeVisible();
 await expect(page.locator('.drill-library .group-toggle')).toHaveCount(3);
 await page.goBack();
 await expect(page.getByRole('heading',{name:'Retreat, cross & re-attack',exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:/Change pace/})).toHaveAttribute('aria-expanded','true');
 await page.reload();
 await expect(page.locator('.drill-library [aria-current=page]')).toBeVisible();
 await page.locator('.drill-related').getByRole('link',{name:'Blitz & rotate',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Blitz & rotate',exact:true})).toBeVisible();
 await page.goBack();
 await expect(page.getByRole('heading',{name:'Retreat, cross & re-attack',exact:true})).toBeVisible();
});

test('every drill has distinct animated phases, court setup and body cues in both views',async({page})=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 for(const drill of drills){
  await page.goto(`/#drills/${drill.id}`);
  await expect(page.getByRole('heading',{name:drill.name,exact:true})).toBeVisible();
  const positions:string[]=[];
  for(let phase=0;phase<4;phase++){
   await page.locator('.drill-phases button').nth(phase).click();
   await expect(page.locator('.mechanics-svg')).toHaveAttribute('aria-label',new RegExp(`phase ${phase+1}:`));
   await expect(page.locator('.mechanics-cues>button')).toHaveCount(3);
   await expect(page.locator('.drill-phase-instruction')).toContainText(drill.phases[phase].action);
   positions.push((await page.locator('.mechanics-ball').getAttribute('transform'))!);
   const coordinates=await page.locator('.mechanics-svg').innerHTML();
   expect(coordinates).not.toMatch(/NaN|undefined/);
  }
  expect(new Set(positions).size).toBeGreaterThan(1);
  await page.getByLabel('Body view',{exact:true}).selectOption('front');
  const front=await page.locator('.body-hands polyline').first().getAttribute('points');
  await page.getByLabel('Body view',{exact:true}).selectOption('side');
  expect(await page.locator('.body-hands polyline').first().getAttribute('points')).not.toBe(front);
  await expect(page.locator('.drill-detail svg')).toHaveCount(3);
  await expect(page.getByRole('region',{name:'Practice plan'})).toContainText(drill.dosage);
 }
 expect(errors).toEqual([]);
});

test('mechanics mirror for the other hand and isolate the chosen body region',async({page})=>{
 await page.goto('/#drills/one-two');
 await page.locator('.drill-phases button').nth(1).click();
 await expect(page.locator('.mechanics-cues')).toContainText('step left then right');
 const original=(await page.locator('.mechanics-ball').getAttribute('transform'))!.match(/[\d.]+/g)!.map(Number);
 await page.getByLabel('Dominant hand',{exact:true}).selectOption('left');
 await expect(page.locator('.mechanics-cues')).toContainText('step right then left');
 const mirrored=(await page.locator('.mechanics-ball').getAttribute('transform'))!.match(/[\d.]+/g)!.map(Number);
 expect(original[0]+mirrored[0]).toBe(640);expect(original[1]).toBe(mirrored[1]);
 await page.getByRole('group',{name:'Mechanics focus'}).getByRole('button',{name:'Hand & ball',exact:true}).click();
 await expect(page.locator('.body-base')).toHaveAttribute('opacity','0.25');
 await expect(page.locator('.body-hands')).toHaveAttribute('opacity','1');
 await page.getByRole('group',{name:'Mechanics focus'}).getByRole('button',{name:'Base & feet',exact:true}).click();
 await expect(page.locator('.body-base')).toHaveAttribute('opacity','1');
 await expect(page.locator('.body-hands')).toHaveAttribute('opacity','0.25');
 await page.goto('/#drills/touch');
 await expect(page.locator('.drill-detail').last()).toContainText('Off hand stays off');
});

test('drill playback, stepping, scrubber, keyboard and responsive mechanics work',async({page})=>{
 await page.goto('/#drills/cross');
 await page.getByRole('button',{name:'Next drill phase',exact:true}).click();
 await expect(page.getByRole('slider',{name:'Drill position'})).toHaveValue('1');
 await page.getByRole('button',{name:'Previous drill phase',exact:true}).click();
 await expect(page.getByRole('slider')).toHaveValue('0');
 await page.getByLabel('Drill playback speed',{exact:true}).selectOption('1');
 await page.getByRole('button',{name:'Play drill animation',exact:true}).click();
 await expect(page.getByRole('button',{name:'Pause drill animation',exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'Play drill animation',exact:true})).toBeVisible({timeout:8000});
 await expect(page.getByRole('slider')).toHaveValue('3');
 await expect(page.getByRole('button',{name:'Next drill phase',exact:true})).toBeDisabled();
 await page.getByRole('slider').fill('1.5');
 await expect(page.locator('.mechanics-svg')).toHaveAttribute('aria-label',/phase 2/);
 await page.getByRole('button',{name:'Reset drill animation'}).click();
 await page.locator('h1').click();await page.keyboard.press('ArrowRight');
 await expect(page.getByRole('slider')).toHaveValue('1');
 for(const width of [320,390,768,1024,1440]){
  await page.setViewportSize({width,height:900});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
});
