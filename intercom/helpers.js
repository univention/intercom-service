const axios = require("axios");
const qs = require("qs");
const https = require('https');
require('dotenv').config();

const fetchOxToken = async (access_token) => {
    var params = {
        'grant_type': 'urn:ietf:params:oauth:grant-type:token-exchange',
        'subject_token': access_token,
        'client_id': process.env.CLIENT_ID,
        'client_secret': process.env.CLIENT_SECRET,
        'audience': "ox_fakeapp"
    }

    return axios.request({
        url: 'http://kc.p.test/auth/realms/CustomerA/protocol/openid-connect/token',
        method: 'POST',
        data: qs.stringify(params),
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
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

const fetchMatrixToken = async (user_id) => {
    const params = {
        //type: "m.login.application_service",
        "type": "uk.half-shot.msc2778.login.application_service",
        identifier: {
            type: "m.id.user",
            user: user_id
        }
    }
    // https://matrix.dpx-sso1.at-univention.de/_matrix/client/r0/user/%40test2%3Amatrix.dpx-sso1.at-univention.de/openid/request_token

// To    Bearer syt_dGVzdDI_ZQCJyPRZRdmXnexGwRKe_1RyDyp
// //pnneEmBRyiFwmHKtuwscejXn
    const headers = {
        Authorization: "Bearer " + process.env.MATRIX_AS_SECRET,
        "Content-Type": "application/json"
    }

    return axios.request({
        url: process.env.MATRIX_URL,
        headers,
        method: "POST",
        data: params,
        proxy: {
            host: 'localhost',
            port: 8079
        },
        httpsAgent: new https.Agent({rejectUnauthorized: false})
    }).then(res => {
        return res.data.access_token
    }).catch(err => {
        console.log(err)
    })
}

const fetchOpenID1Token = async(username, access_token) =>
{
    const r1 = await axios.request({
        method: 'POST',
        url: "https://matrix.dpx-sso1.at-univention.de/_matrix/client/r0/user/%40test2%3Amatrix.dpx-sso1.at-univention.de/openid/request_token",
        headers: {
            "Authorization": `Bearer ${access_token}`,
            "Content-Type": "application/json"
        },
        proxy: {
            host: 'localhost',
            port: 8079
        },
        data: {}
    })
    //let access_token = req.appSession.matrix_access_token
    let openid1_token = r1.data.access_token
    return openid1_token
}



const createRoom = async (roomname, btoken) => {
    const params = {
        "initial_state": [],
        "name": "testraum",
        "preset": "public_chat",
        "room_alias_name": "conf_my-test_" + roomname,
        "visibility": "public"
    }

    let roomid = axios.request({
        method: "POST",
        url: "https://matrix.dpx-sso1.at-univention.de/_matrix/client/api/v1/createRoom",
        headers: {"Authorization": "Bearer " + btoken},
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
module.exports.fetchOpenID1Token =  fetchOpenID1Token
