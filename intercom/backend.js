/*
   Simple Backend for the Browser: OIDC Login, some Methods to call
 */

// Ask providers if there's any ouath in the stack. Oauth as in "I have an access token provided by keycloak and can do stuff via REST, ..."
require('dotenv').config();
const express = require('express')
var app = express();
const {createProxyMiddleware} = require('http-proxy-middleware');
const {fetchMatrixToken, fetchOpenID1Token} = require('./helpers')
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
            // if (!('ox_access_token' in session)) {
            //     ret.ox_access_token = await fetchOxToken(session.access_token)
            // }
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

            if (!('nordeck_access_token' in session)) {
                console.log("fetching nordeck token")
                // TODO: Refactor
                ret.nordeck_access_token = await fetchOpenID1Token(username, ret.matrix_access_token)
            }
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

// session status / login page with silent login
// TODO: Do proper postMessage reporting
app.get('/silent', attemptSilentLogin(), (req, res) => {
    if ('access_token' in req.appSession) {
        // propably check if still valid, get username, ...
        res.send("logged in as xy")
    } else {
        res.send("lost keycloak session, we're doomed")
        // this sets a cookie to only do this once, we probably want that to not hammer keycloak?
    }
});

var server = app.listen(8008, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})
