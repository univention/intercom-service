require('dotenv').config();
const assert = require('assert');
const {logintoOxFake} = require('./helpers')

const {test, expect} = require('@playwright/test')
test('matrix auth for nordeck', async ({browser}) => {
    const context = await browser.newContext({"proxy": {"server": "localhost:8079"}});
    //const context = await browser.newContext();

    const page = await context.newPage();

    await logintoOxFake(page)
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
