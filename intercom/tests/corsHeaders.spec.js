require('dotenv').config();
const assert = require('assert');

const {test} = require('@playwright/test')
const axios = require("axios");
const https = require("https");


test('ICS CORS Headers', async ({request}) => {

    // check CORS headers from oxfake
    const req = await request.get(process.env.INTERCOM_URL, {
        headers: {"origin": process.env.OX_ORIGIN}
    });

    assert(req.headers()["access-control-allow-credentials"] === "true")
    assert(req.headers()["access-control-expose-headers"] === "etag,dav,Content-Security-Policy,Location,Authorization,depth,content-type,ocs-apirequest")
    assert(req.headers()["access-control-allow-origin"] === process.env.OX_ORIGIN)

    // check CORS headers from nextcloud (bc they are dynamic)
    const req2 = await request.get(process.env.INTERCOM_URL, {
        headers: {"origin": process.env.NC_ORIGIN}
    });

    assert(req2.headers()["access-control-allow-credentials"] === "true")
    assert(req2.headers()["access-control-expose-headers"] === "etag,dav,Content-Security-Policy,Location,Authorization,depth,content-type,ocs-apirequest")
    assert(req2.headers()["access-control-allow-origin"] === process.env.NC_ORIGIN)

    // // check Preflight
    // // since Playwright seems to be unable to send OPTIONS requests, we use axios
    // // allow methods are only in the preflight request which seems fine

    const req3 = await axios.request({
        url: process.env.INTERCOM_URL,
        method: "OPTIONS",
    })

    assert(req3.headers["access-control-allow-methods"] === "GET,POST,PUT,DELETE,PROPFIND,MKCOL")
    assert(req3.status === 204)

})
