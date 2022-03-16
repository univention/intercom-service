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

    return axios.request({
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

const fetchMatrixToken = async (user_id) => {
    const params = {
        type: "m.login.application_service",
        //"type": "uk.half-shot.msc2778.login.application_service",
        identifier: {
            type: "m.id.user",
            user: user_id
        }
    }

    const headers = {
        Authorization: "Bearer wfghWEGh3wgWHEf3478sHFWE",
        "Content-Type": "application/json"
    }

    return axios.request({
        url: 'http://matrix.p.test/_matrix/client/r0/login',
        headers,
        method: "POST",
        data: params,
        proxy: {
            host: 'localhost',
            port: 8079
        }
    }).then(res => {
        return res.data.access_token
    }).catch(err => {
        console.log(err)
    })
}

const createRoom = async(roomname, btoken) => {
    const params = {
        "initial_state": [],
        "name": "testraum",
        "preset": "public_chat",
        "room_alias_name": "conf_my-test_" + roomname,
        "visibility": "public"
    }

    let roomid = axios.request({
        method: "POST",
        url: "http://matrix.p.test/_matrix/client/api/v1/createRoom",
        headers:{"Authorization": "Bearer "+btoken},
        data: params,
        proxy: {
            host: 'localhost',
            port: 8079
        }

    }).then(res => {
        return res.data.room_id
    })

    return roomid
}



module.exports.fetchOxToken = fetchOxToken
module.exports.fetchMatrixToken = fetchMatrixToken
module.exports.createRoom = createRoom
