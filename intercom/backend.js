/*
   Simple Backend for the Browser: OIDC Login, some Methods to call
 */

// Ask providers if there's any ouath in the stack. Oauth as in "I have an access token provided by keycloak and can do stuff via REST, ..."
require('dotenv').config();
const express = require('express')
var app = express();
const {fetchOxToken, fetchMatrixToken, createRoom} = require('./helpers')
const {auth, requiresAuth, attemptSilentLogin, claimEquals} = require('express-openid-connect')
const jwt_decode = require("jwt-decode")
// TODO: ADD XSRF Protextion

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
                let username = jwt_decode(session.id_token)['ucs-username']
                ret.matrix_access_token = await fetchMatrixToken(username)
            }
            return {...session, ...ret}
        }
    }))


app.get('/', requiresAuth(), function (req, res) {
    //res.send(`Hello ${req.oidc.user.sub}`);
    res.send("<p>Hello</p>")
})

// app.get("/createConference", requiresAuth(), async (req, res) => {
// // app.get("/createConference", claimEquals('canCreateConference', true), async (req, res) => {
//     // create a room as an example
//
//     let access_token = req.appSession.matrix_access_token
//
//     let roomname = new Date().toISOString().replaceAll(":",";")
//     let room_id = await createRoom(roomname, access_token)
//
//     res.send("Room "+room_id)
// })


app.get("/createAppointment", claimEquals('canCreateAppointment', true), function (req, res) {
    // Dump access token for sake of example
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
