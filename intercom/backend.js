/*
   Simple Backend for the Browser: OIDC Login, some Methods to call
 */

// Ask providers if there's any ouath in the stack. Oauth as in "I have an access token provided by keycloak and can do stuff via REST, ..."
require('dotenv').config();
const express = require('express')
var app = express();
app.set('view engine', 'ejs');
const {createProxyMiddleware} = require('http-proxy-middleware');
const {fetchMatrixToken, fetchOpenID1Token, fetchToken, stripIntercomCookies, massageCors} = require('./helpers')
const {auth, requiresAuth, attemptSilentLogin, claimEquals} = require('express-openid-connect')
const jwt_decode = require("jwt-decode")
// TODO: ADD XSRF Protextion
var cors = require('cors')


var corsOptions = {
    methods: "GET,POST,PUT,DELETE,PROPFIND,MKCOL",
    credentials: true,
    // TODO: can we drop Authorization?
    exposedHeaders: ["etag", "dav", "Content-Security-Policy", "Location", "Authorization", "depth", "content-type", "ocs-apirequest"],
    origin: /(dpx-u5intercom\.at-univention\.de|localhost:8000)$/,
}


app.use(
    auth({
        // TODO; move to environ
        issuerBaseURL: process.env.ISSUER_BASE_URL,
        baseURL: process.env.BASE_URL,
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        authRequired: false,
        secret: process.env.SECRET,
        idpLogout: true,
        authorizationParams: {
            response_type: 'code',
            scope: 'openid'
        },
        afterCallback: async (req, res, session, decodedState) => {

            try {
                var ret = {}
                // fetch token for ox
                // TODO: check also if it's valid
                if (!('ox_access_token' in session)) {
                    ret.ox_access_token = await fetchToken(session.access_token, `${process.env.OX_AUDIENCE}`)
                }
                // fetch token for matrix
                let email = jwt_decode(session.id_token)['email']
                let username = email.substring(0, email.indexOf('@'))
                if (!username) {
                    console.log("Sorry can't find the user, maybe the mapping is missing?")
                }
                let uid = jwt_decode(session.id_token)['preferred_username']

                if (!uid) {
                    console.log("Sorry can't find the preferred username/uuid, maybe the mapping is missing?")
                }

                // TODO: remote matrix uses uuid as username, locally this will not work
                if (!('matrix_access_token' in session)) {
                    console.log("fetching matrix token")
                    // TODO: Get correct Token
                    ret.matrix_access_token = await fetchMatrixToken(uid)
                }

                if (!('nordeck_access_token' in session)) {
                    console.log("fetching nordeck token")
                    ret.nordeck_access_token = await fetchOpenID1Token(uid, ret.matrix_access_token)
                }
            } catch (error) {
                console.log("Error fetching Tokens: " + error)
            }
            return {...session, ...ret}
        }
    }))

app.use(cors(corsOptions))

/**
 * Just a simple Endpoint to check if the service is there and for CORS testing
 */
app.get('/', function (req, res) {
    res.send("<p>Hello</p>")
})

// app.get("/createAppointment", claimEquals('canCreateAppointment', true), function (req, res) {
//     // Dump access token for sake of example
//     res.send("yup")
// })

/**
 * @name /nob/
 * @desc
 * Proxy for the Nordeck Bot (or just the plain Matrix UserInfo Service in testing).
 * Adds the proper Authorization Header
 */
app.use('/nob', requiresAuth(), createProxyMiddleware({
    target: process.env.NORDECK_URL, logLevel: 'debug', changeOrigin: true,
    pathRewrite: {'^/nob': '',},
    onProxyReq: function onProxyReq(proxyReq, req, res) {
        stripIntercomCookies(proxyReq)
        // TODO: Build Switch for Nordeck Live Mode
        // Example headers.set('authorization', `MX-Identity ${btoa(JSON.stringify(t))}`);
        //proxyReq.path += `?access_token=${req.appSession.nordeck_access_token}`;
        let t = new Buffer.from(JSON.stringify(req.appSession.nordeck_access_token)).toString('base64')
        proxyReq.setHeader('authorization', `MX-Identity ${t}`);
    },
    onProxyRes: function (proxyRes, req, res) {
        // TODO: Matrix seems to be specific with it's headers, we have to decide whether to steamroll or to massage...
        massageCors(req, proxyRes, corsOptions.origin)
        // original headers
        //res.getHeaders()
    }
}))


/**
 * @name /fs/
 * @desc
 * Proxy for Nextcloud.
 * Adds the proper Authorization Header
 * @example PROPFIND http://ic.p.test/fs/remote.php/dav/files/usera1/Photos
 *
 */
app.use('/fs', requiresAuth(), createProxyMiddleware({
        target: process.env.NC_URL, logLevel: 'debug', changeOrigin: true,
        pathRewrite: {
            '^/fs': ''
        },
        onProxyReq: function onProxyReq(proxyReq, req, res) {
            // TODO: Service takes pretty much any token which is not good
            stripIntercomCookies(proxyReq)
            proxyReq.setHeader('authorization', `Bearer ${req.appSession.ox_access_token}`);
            console.log(proxyReq)
        },
        onProxyRes: function (proxyRes, req, res) {
            massageCors(req, proxyRes, corsOptions.origin)
        }
    }
))

/**
 * @name "/portal.json (without silly quotes for jsdoc)"
 * @desc
 * Proxy to the portal for global Navigation Data.
 * Adds the proper Authorization Header
 */
app.use('/navigation.json', requiresAuth(), createProxyMiddleware({
    target: process.env.PORTAL_URL, logLevel: 'debug', changeOrigin: true,
    // TODO: Final version will probably be under this path, atm it's a static mock
    //pathRewrite: {'^/navigation.json': '/univention/portal/portal.json'},
    onProxyReq: function onProxyReq(proxyReq, req, res) {
        stripIntercomCookies(proxyReq)
        proxyReq.setHeader('Authorization', `Bearer ${process.env.PORTAL_API_KEY}`);
        proxyReq.setHeader('X-Ucs-Username', jwt_decode(req.appSession.id_token)['preferred_username'])
    }, onProxyRes: function (proxyRes, req, res) {
        massageCors(req, proxyRes, corsOptions.origin)
    }
}))


/**
 * @name /silent
 * @desc
 * Performs a "silent login", eg logs the user into the intercom service without interaction
 * if the user is already logged in to keycloak.
 *
 * Reports the Session Status via window.postmessage (JSON: {"loggedIn": true})
 */
app.get('/silent', attemptSilentLogin(), (req, res) => {
    // TODO: Do proper postMessage reporting
    const sessionStatus = ('access_token' in req.appSession)
    console.log(`Silent login, logged in ${sessionStatus}`)
    res.render("pages/silent", {sessionStatus})
});

/**
 * @name /uuid
 * @desc returns the uuid of the logged in user
 */
app.get("/uuid", requiresAuth(), (req, res) => {
    let entryUUID = jwt_decode(req.appSession.id_token)['preferred_username']
    res.send(entryUUID)
})


var server = app.listen(8008, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Intercom app listening at http://%s:%s", host, port)
})
