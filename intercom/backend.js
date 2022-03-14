/*
   Simple Backend for the Browser: OIDC Login, some Methods to call
 */

// Ask providers if there's any ouath in the stack. Oauth as in "I have an access token provided by keycloak and can do stuff via REST, ..."

const express = require('express')
var app = express();
const axios = require('axios')
const jose = require('jose')
const {fetchOxToken} = require('./helpers')
const {auth, requiresAuth, attemptSilentLogin, claimEquals} = require('express-openid-connect')
const qs = require("qs");

// TODO: ADD XSRF Protextion

const clientID = 'intercom'
const clientSecret = '29125922-de3b-425e-9465-a2f711631f3a'

app.use(
    auth({
        // TODO; move to environ
        issuerBaseURL: 'http://kc.p.test/auth/realms/CustomerA',
        baseURL: 'http://ic.p.test',
        clientID, clientSecret,
        authRequired: false,
        secret: 'sdfgsdfhdsf',
        idpLogout: true,
        authorizationParams: {
            response_type: 'code',
            scope: 'openid conference:all'
        },
        afterCallback: async (req, res, session, decodedState) => {

            var ret = {}
            // fetch token for ox
            // TODO: check also if it's valid
            if (!('ox_access_token' in session)) {
                ret.ox_access_token = fetchOxToken(session.access_token)
            }
            // fetch token for matrix
            return {...session, ...ret}
        }
    }))


app.get('/', requiresAuth(), function (req, res) {
    //res.send(`Hello ${req.oidc.user.sub}`);
    res.send("<p>Hello</p>")
})

app.get("/createConference", claimEquals('canCreateConference', true), function (req, res) {
    // use magic password to get matrix session for user and dump into session
    let access_token = req.appSession.access_token
    res.send("yup")
})


// get file list. use the users access token to get list from nextcloud


// get file. same.

// session status / login page with silent login
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
