require('dotenv').config();
const assert = require('assert');

const {test} = require('@playwright/test')
const axios = require("axios");
const https = require("https");


test('ICS CORS Headers', async ({request}) => {

    // check CORS headers from oxfake
    const req = await request.get("/", {
        headers: {"origin": "http://oxfake.p.test"}
    });

    assert(req.headers()["access-control-allow-credentials"] === "true")
    assert(req.headers()["access-control-expose-headers"] === "etag,dav,Content-Security-Policy,Location,Authorization,depth,content-type,ocs-apirequest")
    assert(req.headers()["access-control-allow-origin"] === "http://oxfake.p.test")

    // check CORS headers from nextcloud (bc they are dynamic)
    const req2 = await request.get("/", {
        headers: {"origin": "http://nc1.p.test"}
    });

    assert(req2.headers()["access-control-allow-credentials"] === "true")
    assert(req2.headers()["access-control-expose-headers"] === "etag,dav,Content-Security-Policy,Location,Authorization,depth,content-type,ocs-apirequest")
    assert(req2.headers()["access-control-allow-origin"] === "http://nc1.p.test")

    // check Preflight
    // since Playwright seems to be unable to send OPTIONS requests, we use axios
    // allow methods are only in the preflight request which seems fine

    const req3 = await axios.request({
        url: "http://ic.p.test",
        method: "OPTIONS",
        proxy: JSON.parse(process.env.PROXY)
    })

    assert(req3.headers["access-control-allow-methods"] === "GET,POST,PUT,DELETE,PROPFIND,MKCOL")
    assert(req3.status === 204)

})
