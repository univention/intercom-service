const {expect} = require("@playwright/test");


const logintoOxFake = async (page) => {
    await page.goto("https://localhost:8000/conference");

    // TODO: Make this optional
    await page.locator('text=●Accept').click();

    await page.locator('input[name="username"]').fill(process.env.TESTUSER);

    await page.locator('input[name="password"]').fill(process.env.TESTPASSWORD);

    // TODO: Make this conditional
    await page.locator('button:has-text("Login")').click();

    // local
    //await page.locator('input:has-text("Sign In")').click();

    await expect(page.locator('text=Imagine Creating a Videoconference')).toBeVisible()

    await expect(page.locator('text={"loggedIn":true}')).toBeVisible()
}

exports.logintoOxFake = logintoOxFake
