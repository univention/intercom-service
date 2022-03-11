// login directly for now

// call createVideoconference

// check if there's a conference
const { test, expect } = require ('@playwright/test')

test('basic test', async ({ page }) => {
    await page.goto('http://ic.p.test');
    await page.type('#username', "usera1")
    await page.type('#password', "univention")
    await page.click('#kc-login')
    await expect(page.locator("text=Hello")).toBeVisible()

    await page.goto('http://ic.p.test/createConference');
    await expect(page.locator("text=yup")).toBeVisible()

});
