import { test, expect } from '@playwright/test';

const offenseLessons = [
 ['pick-pop','Pick & pop'],['pick-roll','Pick & roll'],['short-roll','Short roll'],['spain','Spain pick & roll'],['drive-kick','Drive & kick spacing'],['handoff','Dribble handoff'],
 ['empty-corner','Empty-corner pick & roll'],['ghost-screen','Ghost screen'],['forty-five-cut','45 cut'],['hammer','Hammer action'],
];
const defenseLessons = [
 ['drop-coverage','Drop coverage'],['switch-coverage','Switching ball screens'],['blitz-coverage','Blitz & rotate'],['ice-coverage','ICE the side screen'],['tag-xout','Low-man tag & X-out'],['closeout-contain','Closeout & contain'],
];

test('all sixteen lessons load with four playable frames and contextual reads',async({page})=>{
 const errors: string[]=[];page.on('pageerror',e=>errors.push(e.message));
 for(const [side,lessons] of [['offense',offenseLessons],['defense',defenseLessons]]){
  for(const [id,name] of lessons){
   await page.goto(`/#${side==='defense'?'defense/':''}${id}`);
   await expect(page.getByRole('heading',{name,exact:true})).toBeVisible();
   await expect(page.getByRole('navigation',{name:'Basketball concepts'}).locator('.concept-option')).toHaveCount(lessons.length);
   for(let i=0;i<4;i++){
    await page.locator('.step').nth(i).click();
    await expect(page.getByRole('img',{name:/step [1-4]/})).toHaveAttribute('aria-label',new RegExp(`step ${i+1}`));
   }
   await expect(page.locator('.read-choice')).toHaveCount(3);
   await expect(page.locator('.read-route')).toHaveCount(3);
   const paths=await page.locator('.read-route').evaluateAll(items=>items.map(item=>item.getAttribute('d') || ''));
   expect(paths.every(d=>!d.includes('NaN')&&!d.includes('undefined'))).toBe(true);
  }
 }
 expect(errors).toEqual([]);
});

test('defense view, assignment focus, cross-links and browser history',async({page})=>{
 await page.goto('/#spain');
 await page.getByRole('navigation',{name:'Playbook views'}).getByRole('link',{name:/Defense/}).click();
 await expect(page).toHaveURL(/#defense\/drop-coverage/);
 await page.getByRole('navigation',{name:'Basketball concepts'}).getByRole('button',{name:/Switching ball screens/}).click();
 await page.locator('.step').nth(2).click();
 await page.getByRole('button',{name:/Find the roller/}).click();
 await expect(page.locator('.read-condition')).toContainText('x1 takes 5 immediately');
 await expect(page.locator('.muted-defender')).toHaveCount(4);
 await page.getByRole('checkbox',{name:'Show offense',exact:true}).uncheck();
 await expect(page.locator('.player')).toHaveCount(0);
 await expect(page.locator('.defender')).toHaveCount(5);
 await page.getByRole('checkbox',{name:'Show offense',exact:true}).check();
 await page.getByRole('checkbox',{name:'Assignments',exact:true}).uncheck();
 await expect(page.locator('.read-route')).toHaveCount(0);
 await expect(page.locator('.defensive-movement')).not.toHaveCount(0);
 await page.getByRole('checkbox',{name:'Assignments',exact:true}).check();
 await page.getByRole('navigation',{name:'Playbook views'}).getByRole('link',{name:/Offense/}).click();
 await expect(page.getByRole('heading',{name:'Spain pick & roll',exact:true})).toBeVisible();
 await page.goBack();
 await expect(page.getByRole('heading',{name:'Switching ball screens',exact:true})).toBeVisible();
 await page.locator('.connections').getByRole('button',{name:/Ghost screen/}).click();
 await expect(page.getByRole('heading',{name:'Ghost screen',exact:true})).toBeVisible();
 await expect(page.getByRole('navigation',{name:'Playbook views'}).getByRole('link',{name:/Offense/})).toHaveAttribute('aria-current','page');
 await page.reload();
 await expect(page.getByRole('heading',{name:'Ghost screen',exact:true})).toBeVisible();
});

test('defense category groups, mobile views and expanded playboard',async({page})=>{
 await page.goto('/#defense/tag-xout');
 await expect(page.locator('.concept-option:visible')).toHaveCount(2);
 await page.getByRole('navigation',{name:'Basketball concepts'}).getByRole('button',{name:/Closeout & contain/}).click();
 await expect(page.getByRole('button',{name:'Help & rotations',exact:true})).toHaveAttribute('aria-expanded','true');
 await page.getByRole('navigation',{name:'Basketball concepts'}).getByRole('button',{name:/Low-man tag & X-out/}).click();
 await page.locator('.step').nth(2).click();
 await page.screenshot({path:'/tmp/second-read-defense-desktop.png',fullPage:true});
 await page.getByRole('button',{name:'Expand diagram'}).click();
 await expect(page.getByRole('dialog',{name:'Expanded playboard'})).toBeVisible();
 await expect(page.locator('.read-choice')).toHaveCount(3);
 await page.keyboard.press('Escape');
 await page.setViewportSize({width:390,height:844});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByRole('button',{name:/Close to the corner/}).click();
 await expect(page.locator('.read-condition')).toContainText('x4 splits two threats');
 await page.screenshot({path:'/tmp/second-read-defense-mobile.png',fullPage:true});
 await page.getByRole('navigation',{name:'Playbook views'}).getByRole('link',{name:/Offense/}).click();
 await expect(page.getByRole('heading',{name:'Pick & pop',exact:true})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
