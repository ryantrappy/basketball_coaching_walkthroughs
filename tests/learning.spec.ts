import { test, expect } from '@playwright/test';

test('coverage changes defenders, explanation, reads and focused player job',async({page})=>{
 await page.goto('/#pick-roll');
 await page.locator('.step').nth(2).click();
 const drop=await page.locator('.defender').last().getAttribute('transform');
 await page.getByLabel('Coverage',{exact:true}).selectOption({label:'Switch'});
 await page.locator('.step').nth(2).click();
 expect(await page.locator('.defender').last().getAttribute('transform')).not.toBe(drop);
 await expect(page.locator('.step-panel')).toContainText('Recognize the switch');
 await expect(page.locator('.read-choice').first()).toContainText('Attack the new matchup');
 await page.getByLabel('Follow a player',{exact:true}).selectOption('5');
 await expect(page.locator('.player-job')).toContainText('Player 5');
 await expect(page.locator('.player').nth(4)).toHaveAttribute('opacity','1');
 await expect(page.locator('.player').first()).toHaveAttribute('opacity','0.25');
 await page.getByLabel('Coverage',{exact:true}).selectOption({label:'Blitz'});
 await page.locator('.step').nth(2).click();
 await expect(page.locator('.read-choice').first()).toContainText('Release to the pocket');
 await page.goto('/#empty-corner');
 await page.getByLabel('Coverage',{exact:true}).selectOption({label:'ICE'});
 await page.locator('.step').nth(2).click();
 await expect(page.locator('.step-panel')).toContainText('Reject and draw the big');
 await expect(page.locator('.player').first()).toHaveAttribute('transform','translate(515,225)');
});

test('trainer conceals explanations, stops at decision and plays chosen outcomes',async({page})=>{
 await page.goto('/#two-on-one');
 await page.getByRole('button',{name:'Make the read',exact:true}).click();
 await expect(page.locator('.read-route')).toHaveCount(0);
 await expect(page.locator('.step-panel')).toBeHidden();
 await expect(page.locator('.deeper')).toBeHidden();
 await page.getByRole('slider').fill('3');
 await expect(page.getByRole('slider')).toHaveValue('2');
 await expect(page.getByRole('button',{name:'Next step',exact:true})).toBeDisabled();
 await page.getByRole('button',{name:'Play animation',exact:true}).click();
 await expect(page.getByRole('button',{name:'Play animation',exact:true})).toBeVisible({timeout:8000});
 await expect(page.getByRole('slider')).toHaveValue('2');
 await page.locator('.training-choices button').nth(2).click();
 await expect(page.locator('.read-feedback')).toContainText('High-risk read');
 await expect(page.getByRole('button',{name:'Play animation',exact:true})).toBeVisible({timeout:5000});
 await expect(page.locator('.ball')).toHaveAttribute('transform','translate(300,89)');
 await page.getByRole('button',{name:'Try another read'}).click();
 await page.locator('.training-choices button').first().click();
 await expect(page.locator('.read-feedback')).toContainText('Strong read');
 await page.getByRole('slider').fill('3');
 await expect(page.locator('.ball')).toHaveAttribute('transform','translate(369,90)');
 await page.getByRole('button',{name:'Return to study'}).click();
 await expect(page.locator('.step-panel')).toBeVisible();
});

test('numbers advantages, player responsibilities and training remain usable on mobile',async({page})=>{
 await page.goto('/#three-on-two');
 await expect(page.locator('.player')).toHaveCount(3);
 await expect(page.locator('.defender')).toHaveCount(2);
 await page.getByLabel('Follow a player',{exact:true}).selectOption('3');
 await expect(page.locator('.player-job')).toContainText('Player 3');
 for(const width of [320,390,768]){
  await page.setViewportSize({width,height:844});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 await page.setViewportSize({width:1440,height:1100});
 await page.goto('/#zone-high-post');
 await page.getByLabel('Follow a player',{exact:true}).selectOption('4');
 const first=await page.locator('.player-job').innerText();
 await page.locator('.step').nth(2).click();
 expect(await page.locator('.player-job').innerText()).not.toBe(first);
 await page.screenshot({path:'/tmp/second-read-learning-desktop.png',fullPage:true});
 await page.getByRole('button',{name:'Make the read',exact:true}).click();
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:'/tmp/second-read-trainer-mobile.png',fullPage:true});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
