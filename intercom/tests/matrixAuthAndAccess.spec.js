require('dotenv').config();
const assert = require('assert');

const {test, expect} = require('@playwright/test')
test('matrix auth for nordeck', async ({browser}) => {
    const context = await browser.newContext({"proxy": {"server": "localhost:8079"}});
    //const context = await browser.newContext();

    const page = await context.newPage();

    // login into ox(fake), get "silent login'ed" to ics
    await page.goto("http://oxfake.p.test/conference");

    await page.locator('input[name="username"]').fill(process.env.TESTUSER);

    await page.locator('input[name="password"]').fill(process.env.TESTPASSWORD);

    await page.locator('input:has-text("Sign In")').click();

    await expect(page.locator('text=Imagine Creating a Videoconference')).toBeVisible()

    await expect(page.locator('text={"sessionStatus": true}')).toBeVisible()

    /*
        The following is JS executed in the browser by playwright. A shortcut to not having to implement
        a fake/test app doing all the stuff
     */

    const res = await page.evaluate(async () => {
        const r = await fetch('http://ic.p.test/nob/_matrix/federation/v1/openid/userinfo', {
            method: "GET",
            credentials: 'include',
            mode: 'cors',
        })
        return r.status
    })

    assert(res === 200)


})
