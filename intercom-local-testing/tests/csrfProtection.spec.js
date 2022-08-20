require('dotenv').config();
const assert = require('assert');

const {test, expect} = require('@playwright/test')

/*
This is running against the local ox fake bc we do not have a test system
 */
test('test the csrf protection', async ({browser}) => {
    //const context = await browser.newContext();
    const context = await browser.newContext({"proxy": {"server": "localhost:8079"}});
    const page = await context.newPage();

    // ensure we're not logged in
    await page.goto(`${process.env.OX_ORIGIN}`);

    // Click text=Log in
    await page.locator('text=Log in').click();
    await page.locator('input[name="username"]').fill(process.env.TESTUSER);

    await page.locator('input[name="password"]').fill(process.env.TESTPASSWORD);

    await page.locator('input:has-text("Sign In")').click()

    // access existing endpoint, assert we're logged in

    await expect(page.locator('text=Logged in, user_id:')).toBeVisible()

    // open page which uses the intercom

    await page.goto(`${process.env.OX_ORIGIN}/conference`)

    // access csrf protected endpoint without protection
    const res = await page.evaluate(async (url) => {
        const r = await fetch(`${url}/nob/nordeckfake`, {
            method: "GET",
            credentials: 'include',
            mode: 'cors',
        })
        return r.status
    }, process.env.BASE_URL)
    assert(res === 403)



    // access csrf protected endpoint with protection
    const res2 = await page.evaluate(async (url) => {
        const r = await fetch(`${url}/nob/nordeckfake`, {
            method: "GET",
            credentials: 'include',
            mode: 'cors',
            headers: new Headers({'x-csrf-token': window.sessionStorage.getItem("csrftoken")}),
        })
        return r.status
    }, process.env.BASE_URL)
    assert(res2 === 200)

    await page.pause()
})
