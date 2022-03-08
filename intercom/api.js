const {Issuer} = require('openid-client')
const FormData = require('form-data');
const qs = require('qs')

const axios = require('axios')

async function start() {
    // const keycloakIssuer = await Issuer.discover('http://kc.p.test/auth/realms/CustomerA/.well-known/openid-configuration');
    // //console.log('Discovered issuer %s %O', keycloakIssuer.issuer, keycloakIssuer.metadata);
    //
    // const client = new keycloakIssuer.Client({
    //     client_id: 'intercom',
    //     client_secret: '29125922-de3b-425e-9465-a2f711631f3a',
    //     token_endpoint_auth_method: 'client_secret_basic',
    //     response_types: ['none'],
    //     // id_token_signed_response_alg (default "RS256")
    //     // token_endpoint_auth_method (default "client_secret_basic")
    // }); // => Client
    //
    // client.authorizationUrl({
    //     scope: 'openid email profile',
    //     response_mode: 'form_post',
    //
    // });}


    axios.request({
        url: "http://kc.p.test/auth/realms/CustomerA/protocol/openid-connect/token",
        method: "post",
        auth: {
            username: "intercom",
            password: '29125922-de3b-425e-9465-a2f711631f3a'
        },
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify({"grant_type": "client_credentials", "scope": "email conference:all"}),
        proxy: {
            host: 'localhost',
            port: 8079
        }
    }).then(function (res) {

        //console.log(res);
        var token = res.data.access_token

        var params = {
            'grant_type': 'urn:ietf:params:oauth:grant-type:token-exchange',
            'subject_token': token,
            'client_id': 'intercom',
            'requested_subject': "g-d195349f-966c-430b-862a-6bd047ffa45b",
            // Scope is not implemented atm, thats a bummer
            // but audience is, at least something
            'scope':'conder'
        }
        axios.request({
            url: "http://kc.p.test/auth/realms/CustomerA/protocol/openid-connect/token",
            method: "post",
            auth: {
                username: "intercom",
                password: '29125922-de3b-425e-9465-a2f711631f3a'
            },
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: qs.stringify(params),
            proxy: {
                host: 'localhost',
                port: 8079
            }
        }).then( (res => {
            console.log(res)
        }))


        console.log(token)
    }).catch((err) => {
        console.log(err)
    });

}

start()
