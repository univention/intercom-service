

const {test, expect} = require('@playwright/test')
test('basic test', async ({browser}) => {
    const context = await browser.newContext({"proxy": {"server": "localhost:8079"}});
    const page = await context.newPage();

    // login into ics (local, but with remote keycloak)
    await page.goto('https://ics.dpx-sso1.at-univention.de/');
    // Click text=Accept
    await page.locator('text=●Accept').click();
    // Click [placeholder="Username"]
    await page.locator('[placeholder="Username"]').click();
    // Fill [placeholder="Username"]
    await page.locator('[placeholder="Username"]').fill('test4');
    // Click [placeholder="Password"]
    await page.locator('[placeholder="Password"]').click();
    // Fill [placeholder="Password"]
    // await page.locator('[placeholder="Password"]').fill('UDXEaVYDCZyC6Yv');
    await page.locator('[placeholder="Password"]').fill('7LvKNaQaC2yLsRT2222');
    // Click input:has-text("Login")
    await page.locator('input:has-text("Login")').click();
    await page.pause()

    await expect(page.locator('text=Hello')).toBeVisible()

    await page.goto('https://ics.dpx-sso1.at-univention.de/nob/health')

    const res = await page.evaluate((async () => {
        // This is run inside the browser
        const r = await fetch('https://ics.dpx-sso1.at-univention.de/nob/v1/meeting/create', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "access_type": "ANYONE",
                "allow_widget_manipulation": false,
                "description": "fgdhdfghdfh2",
                "end_time": "2022-03-24T11:15:00.000Z",
                "messaging_role": "NONE",
                "participants": [],
                "start_time": "2022-03-24T10:15:00.000Z",
                "title": "THIS IS PLAYWRIGHT",
                "widgets": ["jitsi", "etherpad", "whiteboard"]
            })
        })
        const result = await r.json()
        console.log(result)
        return result
    }))
    console.log(res)
})
