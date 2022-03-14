const axios = require("axios");
const qs = require("qs");

const clientID = 'intercom'
const clientSecret = '29125922-de3b-425e-9465-a2f711631f3a'

const fetchOxToken = async (access_token) => {
    var params = {
        'grant_type': 'urn:ietf:params:oauth:grant-type:token-exchange',
        'subject_token': access_token,
        'client_id': clientID,
        'client_secret': clientSecret,
        'audience': "ox_fakeapp"
    }

    return await axios.request({
        url: 'http://kc.p.test/auth/realms/CustomerA/protocol/openid-connect/token',
        method: 'POST',
        data: qs.stringify(params),
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        }, proxy: {
            host: 'localhost',
            port: 8079
        }
    }).then(res => {
        // TODO: Store token in Session
        console.log("Here")
        return res.data.access_token
        //res // access using `req.appSession.userProfile`
    }).catch(err => {
        console.log(err)
    })
}

module.exports.fetchOxToken = fetchOxToken
