// log into ox
// check silent login true
// log out of portal
// log in again
// check kc session

require('dotenv').config();
const assert = require('assert');

const {test, expect} = require('@playwright/test')
const {logintoOxFake} = require('./helpers')

test('basic test', async ({browser}) => {
    const context = await browser.newContext({"proxy": {"server": "localhost:8079"}});
    const page = await context.newPage();

    // ensure we're not logged in
    await page.goto(`${process.env.OX_ORIGIN}`);
    await page.locator('text=●Accept').click();

    await page.locator('input[name="username"]').fill(process.env.TESTUSER);

    await page.locator('input[name="password"]').fill(process.env.TESTPASSWORD);

    // TODO: Make this conditional
    await page.locator('button:has-text("Login")').click();

    await page.goto('https://portal.dpx-u5intercom.at-univention.de/univention/portal/#/');
    // Click img
    await page.locator('img').click();
    // assert.equal(page.url(), 'https://portal.dpx-u5intercom.at-univention.de/univention/portal/#/');
    // Click [aria-label="Menu"]
    await page.locator('[aria-label="Menu"]').click();
    // Click div[role="button"]:has-text("Logout")
    await Promise.all([
        page.waitForNavigation(/*{ url: 'https://portal.dpx-u5intercom.at-univention.de/univention/portal/#/' }*/),
        page.locator('div[role="button"]:has-text("Logout")').click()
    ]);
    await page.pause()
})
