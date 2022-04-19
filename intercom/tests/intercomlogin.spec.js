require('dotenv').config();
const assert = require('assert');

const {test, expect} = require('@playwright/test')
test('basic test', async ({browser}) => {
    const context = await browser.newContext({"proxy": {"server": "localhost:8079"}});
    //const context = await browser.newContext();

    const page = await context.newPage();

    // ensure we're not logged in
    await page.goto("http://ic.p.test/silent");

    await expect(page.locator('text=Loggend in status: false')).toBeVisible()

    // delete skipSilentLogin Cookie
    await context.clearCookies()

    // login into ox(fake), get "silent login'ed" to ics
    await page.goto("http://oxfake.p.test/conference");

    await page.locator('input[name="username"]').fill(process.env.TESTUSER);

    await page.locator('input[name="password"]').fill(process.env.TESTPASSWORD);

    await page.locator('input:has-text("Sign In")').click();

    await expect(page.locator('text=Imagine Creating a Videoconference')).toBeVisible()

    await expect(page.locator('text={"sessionStatus":true}')).toBeVisible()

    // check portal navigation
    await page.goto("http://ic.p.test/portal.json");

    await expect(page.locator('text=cn=Datenschutz,cn=entry,cn=portals')).toBeVisible()

    // Reminder: If this fails bc of CORS, the session is not recognized (the user is forwarded to keycloak)

    const res = await page.evaluate(async () => {
        const r = await fetch('http://ic.p.test/fs/remote.php/dav/files/usera1/Photos', {
                    method: "PROPFIND",
            credentials: 'include'

})
        const text = await r.text()
        console.log(text)
        return text
    })

    const b = await res
    assert(b.includes('/Photos/Birdie.jpg'))

})
