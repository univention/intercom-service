// log into ics directly

// call nordeck bot via proxy
// page.evaluate...


//{"access_token":"MTVRwQNbgxVlSSYysOYcqmRX","matrix_server_name":"matrix.dpx-sso1.at-univention.de"}
// post
// /v1/meeting/create
//https://meetings-widget-api.dpx-sso1.at-univention.de/swagger/#/

const {test, expect} = require('@playwright/test')

test('basic test', async ({page}) => {
    // await page.goto('http://ic.p.test');
    // await page.type('#username', "usera1")
    // await page.type('#password', "univention")
    // await page.click('#kc-login')
    // await expect(page.locator('text=Hello')).toBeVisible()

    await page.goto('https://meetings-widget-api.dpx-sso1.at-univention.de');
    await expect(page.locator("text=Cannot GET /")).toBeVisible()

    const res = await page.evaluate(async () => {
        // This is run inside the browser
        const r = await fetch('https://meetings-widget-api.dpx-sso1.at-univention.de/v1/meeting/create', {
            method: "POST",
            headers: {
                "X-Matrix-User-Token": '{"access_token":"fczZahlSRAiMuFiaRESENzxv","matrix_server_name":"matrix.dpx-sso1.at-univention.de"}',
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

});
