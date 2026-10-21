import { test, expect } from '@playwright/test';

test('play types open one at a time without changing the current possession',async({page})=>{
 await page.goto('/#pick-pop');
 const menu=page.getByRole('navigation',{name:'Basketball concepts'});
 await expect(menu.locator('.group-toggle')).toHaveCount(6);
 await expect(menu.getByRole('button',{name:'Ball screens',exact:true})).toHaveAttribute('aria-expanded','true');
 await expect(menu.locator('.concept-option:visible')).toHaveCount(4);
 await menu.getByRole('button',{name:'Off-ball spacing',exact:true}).click();
 await expect(menu.getByRole('button',{name:'Ball screens',exact:true})).toHaveAttribute('aria-expanded','false');
 await expect(menu.locator('.concept-option:visible')).toHaveCount(2);
 await menu.getByRole('button',{name:'45 cut',exact:true}).click();
 await expect(page.getByRole('heading',{name:'45 cut',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Next step',exact:true}).click();
 await menu.getByRole('button',{name:'Off-ball spacing',exact:true}).click();
 await expect(menu.locator('.concept-option:visible')).toHaveCount(0);
 await expect(page.getByRole('img',{name:/step 2/})).toBeVisible();
 await menu.getByRole('button',{name:'Off-ball spacing',exact:true}).press('Enter');
 await expect(menu.locator('.concept-option:visible')).toHaveCount(2);
 await expect(menu.getByRole('button',{name:'45 cut',exact:true})).toHaveAttribute('aria-current','page');
});

test('keyboard selection, related links, history and bookmarks reveal their category',async({page})=>{
 await page.goto('/#defense/drop-coverage');
 const help=page.getByRole('button',{name:'Help & rotations',exact:true});
 await help.focus();await help.press('Space');
 await expect(help).toHaveAttribute('aria-expanded','true');
 await page.getByRole('navigation',{name:'Basketball concepts'}).getByRole('button',{name:'Closeout & contain',exact:true}).click();
 await page.locator('.connections').getByRole('button',{name:/45 cut/}).click();
 await expect(page.getByRole('button',{name:'Off-ball spacing',exact:true})).toHaveAttribute('aria-expanded','true');
 await expect(page.locator('.concept-option[aria-current=page]')).toBeVisible();
 await page.goBack();
 await expect(page.getByRole('button',{name:'Help & rotations',exact:true})).toHaveAttribute('aria-expanded','true');
 await expect(page.getByRole('heading',{name:'Closeout & contain',exact:true})).toBeVisible();
 await page.goto('/#inbounds/sideline-slip');
 await expect(page.getByRole('button',{name:'Sideline (SLOB)',exact:true})).toHaveAttribute('aria-expanded','true');
 await expect(page.getByRole('button',{name:'Baseline (BLOB)',exact:true})).toHaveAttribute('aria-expanded','false');
 await page.reload();
 await expect(page.locator('.concept-option[aria-current=page]')).toBeVisible();
});

test('category dropdowns remain usable on small screens',async({page})=>{
 await page.goto('/#pick-pop');
 await page.screenshot({path:'/tmp/second-read-categories-desktop.png',fullPage:true});
 for(const width of [320,390,768]){
  await page.setViewportSize({width,height:844});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 await page.setViewportSize({width:390,height:844});
 await page.getByRole('button',{name:'Three-player actions',exact:true}).click();
 await page.getByRole('navigation',{name:'Basketball concepts'}).getByRole('button',{name:'Spain pick & roll',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Spain pick & roll',exact:true})).toBeVisible();
 await expect(page.locator('.concept-option:visible')).toHaveCount(2);
 await page.screenshot({path:'/tmp/second-read-categories-mobile.png',fullPage:true});
});
