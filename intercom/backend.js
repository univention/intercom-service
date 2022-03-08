/*
   Simple Backend for the Browser: OIDC Login, some Methods to call
 */

// Ask providers if there's any ouath in the stack. Oauth as in "I have an access token provided by keycloak and can do stuff via REST, ..."

const express = require('express')
var app = express();
const axios = require('axios')
const jose = require('jose')


const {auth, requiresAuth, attemptSilentLogin, claimEquals} = require('express-openid-connect')
app.use(
    auth({
        // move to environ
        issuerBaseURL: 'http://kc.p.test/auth/realms/CustomerA',
        baseURL: 'http://ic.p.test',
        clientID: 'intercom',
        clientSecret: '29125922-de3b-425e-9465-a2f711631f3a',
        authRequired: false,
        secret: 'sdfgsdfhdsf',
        idpLogout: true,
        authorizationParams: {
            response_type: 'code',
            scope: 'openid conference:all'
        },
        afterCallback: async (req, res, session, decodedState) => {



            const claims = jose.JWT.decode(session.id_token);
            var params = {
                'grant_type': 'urn:ietf:params:oauth:grant-type:token-exchange',
                'subject_token': claims.sub,
                'client_id': 'intercom',
                'requested_subject': currentUserAccessToken
            }
            console.log("BLA")

            // axios.get('http://kc.p.test/auth/realms/CustomerA/protocol/openid-connect/userinfo').then( res => {
            //     return {
            //         ...session,
            //         res // access using `req.appSession.userProfile`
            //     };
            // }).catch(err => {
            //     console.log(err)
            // })

        }
    }))


app.get('/', requiresAuth(), function (req, res) {
    res.send('Hello ${req.oidc.user.sub}');
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
