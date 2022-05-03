const {expect} = require("@playwright/test");


const logintoOxFake = async (page) => {
    // TODO: Configurable...
    await page.goto("http://localhost:8000/conference");

    // ucs login or kc login
    if (process.env.MODE === "remote") {
        await page.locator('text=●Accept').click();

        await page.locator('input[name="username"]').fill(process.env.TESTUSER);

        await page.locator('input[name="password"]').fill(process.env.TESTPASSWORD);

        // TODO: Make this conditional
        await page.locator('button:has-text("Login")').click();

    } else {
        await page.locator('input[name="username"]').fill(process.env.TESTUSER);

        await page.locator('input[name="password"]').fill(process.env.TESTPASSWORD);

        await page.locator('input:has-text("Sign In")').click();
    }

    await expect(page.locator('text=Imagine Creating a Videoconference')).toBeVisible()

    await expect(page.locator('text={"loggedIn":true}')).toBeVisible()
}

exports.logintoOxFake = logintoOxFake
