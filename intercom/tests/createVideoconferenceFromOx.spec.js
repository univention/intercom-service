require('dotenv').config();
const assert = require('assert');

const {test, expect} = require('@playwright/test')

test('basic test', async ({browser}) => {
     const context = await browser.newContext();
    //const context = await browser.newContext({"proxy": {"server": "localhost:8079"}});
    const page = await context.newPage();

    // ensure we're not logged in
    await page.goto(`${process.env.OX_ORIGIN}`);
    await page.locator('text=●Accept').click();

    await page.locator('input[name="username"]').fill(process.env.TESTUSER);

    await page.locator('input[name="password"]').fill(process.env.TESTPASSWORD);

    await page.locator('button:has-text("Login")').click();

    await page.locator('[aria-label="Navigieren\\ zu\\:"]').click();
    await Promise.all([
        page.waitForNavigation(),
        page.locator('a[role="menuitem"]:has-text("Kalender")').click()
    ]);
    // Click text=Neuer Termin
    await page.locator('text=Neuer Termin').click();
    // Select element
    await page.locator('select[name="conference-type"]').selectOption('element');

    // get meeting link
    const linklocator = await page.locator('[href*="room"]')
    const conferenceLink = await linklocator.getAttribute("href")

    const [page1] = await Promise.all([
        page.waitForEvent('popup'),
        page.locator(`text=${conferenceLink}`).click()
    ]);
    await page1.goto(conferenceLink);
    await expect(page1.locator('text=Do you want to join Terminplaner Bot?')).toBeVisible({ timeout: 30000 })
})
