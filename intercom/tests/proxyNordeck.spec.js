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
    await page.pause()

    await expect(page.locator('text=Hello')).toBeVisible()

    await page.goto('http://ic.p.test/nob/health')

    const res = await page.evaluate(async () => {
        // This is run inside the browser
        const r = await fetch('http://ic.p.test/nob/v1/meeting/create', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "access_type": "ANYONE",
                "allow_widget_manipulation": false,
                "description": "fgdhdfghdfh",
                "end_time": "2022-03-18T11:15:00.000Z",
                "messaging_role": "NONE",
                "participants": [],
                "start_time": "2022-03-18T10:15:00.000Z",
                "title": "THIS IS PLAYWRIGHT",
                "widgets": ["jitsi", "etherpad", "whiteboard"]
            })
        })
        return r.json()
    })

    console.log(res)
    await page.pause()
    // access local
})
