require('dotenv').config();
const assert = require('assert');

const {test, expect} = require('@playwright/test')
const {logintoOxFake} = require('./helpers')

test('basic test', async ({browser}) => {
    const context = await browser.newContext({"proxy": {"server": "localhost:8079"}});
    // const context = await browser.newContext();

    const page = await context.newPage();

    // ensure we're not logged in
    await page.goto(`${process.env.INTERCOM_URL}/silent`);

    await expect(page.locator('text=Loggend in status: false')).toBeVisible()

    // delete skipSilentLogin Cookie
    await context.clearCookies()

    await (logintoOxFake(page))

    // check portal navigation
    await page.goto(`${process.env.INTERCOM_URL}/navigation.json`);

    await expect(page.locator('text="identifier": "ux_fileshare",')).toBeVisible()

    // Reminder: If this fails bc of CORS, the session is not recognized (the user is forwarded to keycloak)

    const res = await page.evaluate(async ({url, user}) => {
        const r = await fetch(`${url}/fs/remote.php/dav/files/581aed746e1d923e3372f9fb487daab7736b24b78c76426179ef77b7c63f7eaa/`, {
            method: "PROPFIND",
            credentials: 'include'

        } )
        const text = await r.text()
        console.log(text)
        return text
    }, {url: process.env.INTERCOM_URL, user:process.env.TESTUSER})

    const b = await res
    assert(b.includes('<d:href>/remote.php/dav/files/'))

})
