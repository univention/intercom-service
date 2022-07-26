require('dotenv').config();
const assert = require('assert');

const {test, expect} = require('@playwright/test')

/*
This is running against the local ox fake bc we do not have a test system
 */
test('test the csrf protection', async ({browser}) => {
    //const context = await browser.newContext();
    const context = await browser.newContext({"proxy": {"server": "localhost:8079"}});
    const page = await context.newPage();

    // ensure we're not logged in
    await page.goto(`${process.env.OX_ORIGIN}`);

    // Click text=Log in
    await page.locator('text=Log in').click();
    await page.locator('input[name="username"]').fill(process.env.TESTUSER);

    await page.locator('input[name="password"]').fill(process.env.TESTPASSWORD);

    await page.locator('input:has-text("Sign In")').click()

    // access existing endpoint, assert we're logged in

    await expect(page.locator('text=Logged in, user_id:')).toBeVisible()

    // open page which uses the intercom

    await page.goto(`${process.env.OX_ORIGIN}/conference`)

    // access csrf protected endpoint without protection

    // access csrf protected endpoint with protection




    await page.pause()
})
