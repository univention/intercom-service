const {expect} = require("@playwright/test");


const logintoOxFake = async (page) => {
    await page.goto("http://oxfake.p.test/conference");

    await page.locator('input[name="username"]').fill(process.env.TESTUSER);

    await page.locator('input[name="password"]').fill(process.env.TESTPASSWORD);

    await page.locator('input:has-text("Sign In")').click();

    await expect(page.locator('text=Imagine Creating a Videoconference')).toBeVisible()

    await expect(page.locator('text={"loggedIn":true}')).toBeVisible()
}

exports.logintoOxFake = logintoOxFake
