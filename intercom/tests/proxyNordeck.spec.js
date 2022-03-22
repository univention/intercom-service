const {test, expect} = require('@playwright/test')
test('basic test', async ({page}) => {
    // login into ics (local, but with remote keycloak)
    await page.goto('http://ic.p.test');
    // Click text=Accept
    await page.locator('text=●Accept').click();
    // Click [placeholder="Username"]
    await page.locator('[placeholder="Username"]').click();
    // Fill [placeholder="Username"]
    await page.locator('[placeholder="Username"]').fill('test2');
    // Click [placeholder="Password"]
    await page.locator('[placeholder="Password"]').click();
    // Fill [placeholder="Password"]
    await page.locator('[placeholder="Password"]').fill('UDXEaVYDCZyC6Yv');
    // Click input:has-text("Login")
    await page.locator('input:has-text("Login")').click();
    await expect(page.locator('text=Hello')).toBeVisible()
    await page.pause()

    await page.goto('http://ic.p.test/createConference');
    //await page.goto('http://ic.p.test/nob/health');


    // access local
})
