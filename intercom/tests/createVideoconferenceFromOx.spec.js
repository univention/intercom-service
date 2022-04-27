require('dotenv').config();
const assert = require('assert');

const {test, expect} = require('@playwright/test')

test('basic test', async ({browser}) => {
    const context = await browser.newContext({"proxy": {"server": "localhost:8079"}});
    const page = await context.newPage();

    // ensure we're not logged in
    await page.goto(`${process.env.OX_ORIGIN}`);
    await page.locator('text=●Accept').click();

    await page.locator('input[name="username"]').fill(process.env.TESTUSER);

    await page.locator('input[name="password"]').fill(process.env.TESTPASSWORD);

    await page.locator('button:has-text("Login")').click();

    await page.locator('[aria-label="Navigieren\\ zu\\:"]').click();
    // Click a[role="menuitem"]:has-text("Kalender")
    await Promise.all([
        page.waitForNavigation(/*{ url: 'https://webmail.dpx-u5intercom.at-univention.de/appsuite/#!!&app=io.ox/calendar&folder=cal://0/331&perspective=week:workweek' }*/),
        page.locator('a[role="menuitem"]:has-text("Kalender")').click()
    ]);
    // Click text=Neuer Termin
    await page.locator('text=Neuer Termin').click();
    // Select element
    await page.locator('select[name="conference-type"]').selectOption('element');
    // Click text=KonferenzKeineVideo-MeetingErzeuge Konferenzraum...
    await page.locator('text=KonferenzKeineVideo-MeetingErzeuge Konferenzraum...').click();

    await page.pause()
})
