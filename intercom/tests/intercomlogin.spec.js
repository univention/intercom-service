require('dotenv').config();

const {test, expect} = require('@playwright/test')
test('basic test', async ({browser}) => {
    const context = await browser.newContext({"proxy": {"server": "localhost:8079"}});
    //const context = await browser.newContext();

    const page = await context.newPage();

    // login into ox(fake)
    await page.goto("http://oxfake.p.test/conference");

    await page.locator('input[name="username"]').fill(process.env.TESTUSER);

    await page.locator('input[name="password"]').fill(process.env.TESTPASSWORD);

    await page.locator('input:has-text("Sign In")').click();

    await expect(page.locator('text=Imagine Creating a Videoconference')).toBeVisible()

    await expect(page.locator('text=ICS Session Status: true')).toBeVisible()

    await page.pause()

})
