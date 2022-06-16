require('dotenv').config();
const assert = require('assert');

const {test, expect} = require('@playwright/test')
const jwt_decode = require("jwt-decode")
const {logintoOxFake} = require("./helpers");

const checkToken = (token) => {
    // get current time in seconds since epoch
    const now = Math.round(Date.now() / 1000)
    // check the token was issued around the current time
    assert(token.iat >= now -5 && token.iat < now +5)
    assert(token.azp == "intercom")

    // check username
    // check entryUUID
    assert(token.entryuuid)
    assert(token.phoenixusername)
}


test('Test all Tokens', async ({browser}) => {
    const context = await browser.newContext({"proxy": {"server": "localhost:8079"}});
    // const context = await browser.newContext();

    const page = await context.newPage();

    // ensure we're not logged in
    await page.goto(`${process.env.INTERCOM_URL}/silent`);

    await expect(page.locator('text=Loggend in status: false')).toBeVisible()

    // delete skipSilentLogin Cookie
    await context.clearCookies()

    await (logintoOxFake(page))

    await page.goto(`${process.env.INTERCOM_URL}/tokenleak`)

    const id_token = JSON.parse(await page.locator('[data-id=id_token]').innerText())

    checkToken(id_token)
    // check token is valid for 5 min (there is no need for the id token to be valid for a prolonged time, it's just checked to generate the session
    assert(id_token.exp == id_token.iat + 300)

    // https://www.keycloak.org/docs/latest/server_admin/#audience-support
    const access_token = JSON.parse(await page.locator('[data-id=access_token]').innerText())
    checkToken(access_token)
    assert(access_token.aud == "intercom")
    // the access token is only used to generate client specific tokens after login, it does not need a long exp
    assert(access_token.exp == access_token.iat + 300)

    const ox_access_token = JSON.parse(await page.locator('[data-id=ox_access_token]').innerText())
    checkToken(ox_access_token)

    assert(ox_access_token.aud == "oxoidc")
    assert(ox_access_token.exp == id_token.iat + 60 * 60 * 8)


    await page.pause()

    // TODO: request phoenix token as non phoenix user

    // const j = await res.json()

    // const id_token = jwt_decode(j['id_token'])
    // const access_token = jwt_decode(j['access_token'])
    //
    // expect(id_token.context).toBe("2")
    // expect(id_token.preferred_username).toBe("Test-User")
    // expect(id_token.entryuuid).toBe("aaaaaa-5dc1-103c-89fd-9d4aedc8640d")
    //
    // console.log(JSON.stringify(id_token))
    // console.log(JSON.stringify(access_token))



})
