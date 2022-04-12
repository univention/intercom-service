/*
   Simple Backend for the Browser: OIDC Login, some Methods to call
 */

// Ask providers if there's any ouath in the stack. Oauth as in "I have an access token provided by keycloak and can do stuff via REST, ..."
require('dotenv').config();
const express = require('express')
var app = express();
app.set('view engine', 'ejs');
const {createProxyMiddleware} = require('http-proxy-middleware');
const {fetchMatrixToken, fetchOpenID1Token, fetchToken} = require('./helpers')
const {auth, requiresAuth, attemptSilentLogin, claimEquals} = require('express-openid-connect')
const jwt_decode = require("jwt-decode")
// TODO: ADD XSRF Protextion
const axios = require("axios");

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

            var ret = {}
            // fetch token for ox
            // TODO: check also if it's valid
            if (!('ox_access_token' in session)) {
                ret.ox_access_token = await fetchToken(session.access_token, "ox_fakeapp")
            }
            // fetch token for matrix
            // TODO: put in session as well
            let email = jwt_decode(session.id_token)['email']
            let username = email.substring(0, email.indexOf('@'))
            if (!username) {
                res.status(404).send("Sorry can't find the user, maybe the mapping is missing?")
            }
            if (!('matrix_access_token' in session)) {
                console.log("fetching matrix token")
                // TODO: Get correct Token
                // let username = jwt_decode(session.id_token)['preferred_username']
                ret.matrix_access_token = await fetchMatrixToken(username)
            }
            // Thorsten changed the Requirements, we're going API-Key
            // if (!('portal_token' in session)) {
            //     console.log("fetching portal token")
            //     ret.portal_token = await fetchToken(session.access_token, "portal")
            // }

            // if (!('nordeck_access_token' in session)) {
            //     console.log("fetching nordeck token")
            //     // TODO: Refactor
            //     ret.nordeck_access_token = await fetchOpenID1Token(username, ret.matrix_access_token)
            // }
            return {...session, ...ret}
        }
    }))


app.get('/', requiresAuth(), function (req, res) {
    res.send("<p>Hello</p>")
})

app.get("/createAppointment", claimEquals('canCreateAppointment', true), function (req, res) {
    // Dump access token for sake of example
    res.send("yup")
})

app.use('/nob', requiresAuth(), createProxyMiddleware({
    target: process.env.NORDECK_URL, logLevel: 'debug', changeOrigin: true,
    pathRewrite: {'^/nob': ''},
    onProxyReq: function onProxyReq(proxyReq, req, res) {
        proxyReq.setHeader('X-Matrix-User-Token', `{"access_token":"${req.appSession.nordeck_access_token}","matrix_server_name":"${process.env.MATRIX_SERVER_NAME}"}`);
    }
}))


app.use('/remote.php', requiresAuth(), createProxyMiddleware({
        target: process.env.NC_URL, logLevel: 'debug', changeOrigin: true,
        onProxyReq: function onProxyReq(proxyReq, req, res) {
            // TODO: Service takes pretty much any token which is not good
            proxyReq.setHeader('authorization', `Bearer ${req.appSession.ox_access_token}`);
        },
        onProxyRes: function onProxyRes(proxyRes, req, res) {
            proxyRes.on('data', function (data) {
               // console.log(data.toString())
            });
        }
    }
))


app.use('/portal.json', requiresAuth(), createProxyMiddleware({
    target: process.env.PORTAL_URL, logLevel: 'debug', changeOrigin: true,
    pathRewrite: {'^/portal.json': '/univention/portal/portal.json'},
    onProxyReq: function onProxyReq(proxyReq, req, res) {
        proxyReq.setHeader('Authorization', `Bearer ${process.env.PORTAL_API_KEY}`);
        proxyReq.setHeader('X-Ucs-Username', jwt_decode(req.appSession.id_token)['preferred_username'])
    }
}))

// TODO: Do proper postMessage reporting
app.get('/silent', attemptSilentLogin(), (req, res) => {
    const sessionStatus = ('access_token' in req.appSession)
    res.render("pages/silent", {sessionStatus})
});

app.get("/uuid", requiresAuth(), (req, res) => {
    let entryUUID = jwt_decode(req.appSession.id_token)['preferred_username']
    res.send(entryUUID)
})

var server = app.listen(8008, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})
