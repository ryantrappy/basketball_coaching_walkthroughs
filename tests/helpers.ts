import type { Page } from '@playwright/test';
export async function selectLesson(page: Page, name: string) {
 const option=page.locator('.concept-option').filter({has:page.getByText(name,{exact:true})});
 const group=page.locator('.concept-group').filter({has:option});
 const toggle=group.locator('.group-toggle');
 if(await toggle.getAttribute('aria-expanded')==='false')await toggle.click();
 await option.click();
}
