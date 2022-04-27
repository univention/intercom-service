require('dotenv').config();
const assert = require('assert');
const {logintoOxFake} = require('./helpers')

const {test, expect} = require('@playwright/test')
test('matrix auth for nordeck', async ({browser, request}) => {
    const context = await browser.newContext({"proxy": {"server": "localhost:8079"}});
    //const context = await browser.newContext();

    const noCorsReq = await request.get(`${process.env.INTERCOM_URL}/nob/v1/health`);
    expect(noCorsReq.ok()).toBeTruthy();

    const page = await context.newPage();

    await logintoOxFake(page)
    /*
        The following is JS executed in the browser by playwright. A shortcut to not having to implement
        a fake/test app doing all the stuff
     */
    const res = await page.evaluate(async (url) => {
        const r = await fetch(`${url}/nob/v1/health`, {
            method: "GET",
            credentials: 'include',
            mode: 'cors',
        })
        return r.status
    }, process.env.INTERCOM_URL)
    assert(res === 200)


    const res2 = await page.evaluate(async (url) => {
        const r = await fetch(`${url}/nob//v1/meeting/create`, {
            method: "POST",
            credentials: 'include',
            mode: 'cors',
        })
        return r.text()
    }, process.env.INTERCOM_URL)
    // we're just checking auth, so this error message is a success
    assert(res2 === '{"statusCode":400,"message":["title must be a string","description must be a string","start_time must be a valid ISO 8601 date string","end_time must be a valid ISO 8601 date string"],"error":"Bad Request"}')
})
