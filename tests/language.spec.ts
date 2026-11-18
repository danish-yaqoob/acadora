import { test, expect } from '@playwright/test';
test('Simplified Chinese persists, works offline, preserves content and enum values',async({page,context})=>{
 await page.goto('/');await page.getByRole('button',{name:'Skip for now'}).click();
 await page.getByRole('button',{name:'Settings',exact:true}).click();
 await page.getByLabel('Language').selectOption('zh-CN');await page.getByRole('button',{name:'Save preferences'}).click();
 await expect(page.locator('html')).toHaveAttribute('lang','zh-CN');
 await expect(page.getByRole('heading',{name:'设置',exact:true})).toBeVisible();
 for(const [name,heading] of [['我的课程','我的课程'],['学习计划','学习计划'],['日历','日历'],['专注计时器','专注计时器'],['学习统计','学习统计'],['笔记','笔记']]){await page.getByRole('button',{name,exact:true}).click();await expect(page.getByRole('heading',{name:heading,exact:true})).toBeVisible();}
 await page.getByRole('navigation').getByRole('button',{name:'任务',exact:true}).click();await page.getByRole('button',{name:'新建任务',exact:true}).click();
 await page.getByLabel('标题',{exact:true}).fill('Dashboard');await page.getByLabel('优先级',{exact:true}).selectOption('High');await page.getByRole('button',{name:'保存任务',exact:true}).click();await expect(page.getByRole('button',{name:'完成 Dashboard'})).toBeVisible();
 await page.reload();await expect(page.locator('html')).toHaveAttribute('lang','zh-CN');
 await page.screenshot({path:'docs/dashboard-chinese.png',fullPage:true});await page.getByRole('navigation').getByRole('button',{name:'任务',exact:true}).click();await expect(page.getByRole('button',{name:'完成 Dashboard'})).toBeVisible();
 await page.evaluate(async()=>{await navigator.serviceWorker.ready;});await page.reload();await context.setOffline(true);await page.reload();await expect(page.getByRole('button',{name:'设置',exact:true})).toBeVisible();await context.setOffline(false);
 await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'展开或收起导航'}).click();await page.getByRole('button',{name:'设置',exact:true}).click();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByLabel('语言 / Language').selectOption('en');await page.getByRole('button',{name:'保存偏好设置'}).click();await expect(page.locator('html')).toHaveAttribute('lang','en');
 await page.getByRole('button',{name:'Toggle navigation'}).click();await page.getByRole('button',{name:'Tasks',exact:true}).click();await expect(page.getByRole('button',{name:'Complete Dashboard'})).toBeVisible();await expect(page.locator('.task-row .priority').filter({hasText:'High'})).toBeVisible();
});
