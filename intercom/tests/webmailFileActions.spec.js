require('dotenv').config();
const assert = require('assert');
const {logintoOxFake} = require('./helpers')

const {test, expect} = require('@playwright/test')
test('test nextcloud actions', async ({browser}) => {
    const context = await browser.newContext({"proxy": {"server": "localhost:8079"}});
    //const context = await browser.newContext();

    const page = await context.newPage();

    await logintoOxFake(page)
    /*
        The following is JS executed in the browser by playwright. A shortcut to not having to implement
        a fake/test app doing all the stuff
     */

    // test preview creation


    const res = await page.evaluate(async (url) => {
        // TODO: Get valid fileId somehow beforehand
        const r = await fetch(`${url}/fs/index.php/core/preview?fileId=587&x=128&y=128&forceIcon=0&a=0`, {
            method: "GET",
            credentials: 'include'

        })
        return r.status
    }, process.env.INTERCOM_URL)
    await page.pause()
    assert(res === 200)



    // test link creation
    const f = async (url) => {
        const r = await fetch(`${url}/fs/ocs/v2.php/apps/files_sharing/api/v1/shares`, {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify({path: "/asdf.md", shareType: 3})
        })
        return r.status
    }

    const res2 = await page.evaluate(f, process.env.INTERCOM_URL)
    assert(res2 === 200)

    // Test webdav access
    const res3 = await page.evaluate(async (url) => {
        // TODO: "un-hardcode" this
        const r = await fetch(`${url}/fs/remote.php/dav/files/d501471a-80ce-103c-9ad5-f1c8339d3a78`, {
            method: "PROPFIND",
            credentials: 'include'

        })
        const text = await r.text()
        console.log(text)
        return text
    }, process.env.INTERCOM_URL)

    assert(res3.includes('<d:href>/remote.php/dav/files/'))
})
