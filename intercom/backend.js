/*
   Simple Backend for the Browser: OIDC Login, some Methods to call
 */

// Ask providers if there's any ouath in the stack. Oauth as in "I have an access token provided by keycloak and can do stuff via REST, ..."
require('dotenv').config();
const express = require('express')
var app = express();
var proxy = require('express-http-proxy');

// or use https://github.com/chimurai/http-proxy-middleware !!!
const {fetchOxToken, fetchMatrixToken, createRoom} = require('./helpers')
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
            if (!('matrix_access_token' in session)) {
                console.log("fetching matric token")
                let email = jwt_decode(session.id_token)['email']
                let username = email.substring(0,email.indexOf('@'))
                // TODO: Get correct Token
                // let username = jwt_decode(session.id_token)['preferred_username']
                if (!username) {
                    res.status(404).send("Sorry can't find the user, maybe the mapping is missing?")
                }
                ret.matrix_access_token = await fetchMatrixToken(username)
            }
            return {...session, ...ret}
        }
    }))


app.get('/', requiresAuth(), function (req, res) {
    //res.send(`Hello ${req.oidc.user.sub}`);
    res.send("<p>Hello</p>")
})

app.get("/createConference", requiresAuth(), async (req, res) => {
    // app.get("/createConference", claimEquals('canCreateConference', true), async (req, res) => {
    // create a room as an example

    // get other token
    // todo get username from sessoin
    const r1 = await axios.request({
        method: 'POST',
        url: "https://matrix.dpx-sso1.at-univention.de/_matrix/client/r0/user/%40test2%3Amatrix.dpx-sso1.at-univention.de/openid/request_token",
        headers: {
            "Authorization": `Bearer ${req.appSession.matrix_access_token}`,
            "Content-Type": "application/json"
        },
        proxy: {
            host: 'localhost',
            port: 8079
        },
        data: {}
    })


    //let access_token = req.appSession.matrix_access_token
    let access_token =r1.data.access_token
    let roomname = new Date().toISOString().replaceAll(":",";")
    // let room_id = await createRoom(roomname, access_token)
    const r = await axios.request('https://meetings-widget-api.dpx-sso1.at-univention.de/v1/meeting/create', {
        method: "POST",
        headers: {
            "X-Matrix-User-Token": `{"access_token":"${access_token}","matrix_server_name":"matrix.dpx-sso1.at-univention.de"}`,
            "Content-Type": "application/json"
        },
        proxy: {
            host: 'localhost',
            port: 8079
        },
        data: JSON.stringify({
            "access_type": "ANYONE",
            "allow_widget_manipulation": false,
            "description": "fgdhdfghdfh",
            "end_time": "2022-03-18T11:15:00.000Z",
            "messaging_role": "NONE",
            "participants": [],
            "start_time": "2022-03-18T10:15:00.000Z",
            "title": "THIS IS PLAYWRIGHT",
            "widgets": ["jitsi", "etherpad", "whiteboard"]
        })
    })

    res.send("Room "+r.data)
})


app.get("/createAppointment", claimEquals('canCreateAppointment', true), function (req, res) {
    // Dump access token for sake of example
    res.send("yup")
})


app.use('/nob', requiresAuth(), proxy('https://meetings-widget-api.dpx-sso1.at-univention.de'));


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
