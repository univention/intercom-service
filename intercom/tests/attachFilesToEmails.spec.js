require('dotenv').config();
const assert = require('assert');

const {test, expect} = require('@playwright/test')

test('test ox interaction with nextcloud', async ({browser}) => {
     const context = await browser.newContext();
    //const context = await browser.newContext({"proxy": {"server": "localhost:8079"}});
    const page = await context.newPage();

    // ensure we're not logged in
    await page.goto(`${process.env.OX_ORIGIN}`);
    await page.locator('text=●Accept').click();

    await page.locator('input[name="username"]').fill(process.env.TESTUSER);

    await page.locator('input[name="password"]').fill(process.env.TESTPASSWORD);

    await page.locator('button:has-text("Login")').click();

    await page.locator('[aria-label="Neue\\ E-Mail\\ verfassen"]').click();
    await page.locator('text=Link von Dateien hinzufügenVon Dateien hinzufügen >> a[role="button"]').click();
    await page.locator('text=Link von Dateien hinzufügen').click();
    await expect(page.locator('td:has-text("asdf.md")')).toBeVisible();

    await page.locator('div.modal-container button.closeButton').click();
    await page.locator('text=Link von Dateien hinzufügenVon Dateien hinzufügen >> a[role="button"]').click();
    await page.locator('text=Von Dateien hinzufügen').nth(1).click();
    await expect(page.locator('text=asdf.md')).toBeVisible();
    await page.locator('div.modal-container button.closeButton').click();


    await page.pause()
})
