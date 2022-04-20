const axios = require("axios");
const qs = require("qs");
const https = require('https');
require('dotenv').config();

const fetchToken = async (access_token, audience) => {
    var params = {
        'grant_type': 'urn:ietf:params:oauth:grant-type:token-exchange',
        'subject_token': access_token,
        'client_id': process.env.CLIENT_ID,
        'client_secret': process.env.CLIENT_SECRET,
        'audience': audience
    }

    return axios.request({
        url: process.env.ISSUER_BASE_URL + '/protocol/openid-connect/token',
        method: 'POST',
        data: qs.stringify(params),
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        proxy: JSON.parse(process.env.PROXY),
    }).then(res => {
        return res.data.access_token
    })
}

const fetchMatrixToken = async (user_id) => {
    const params = {
        //type: "m.login.application_service",
        "type": process.env.MATRIX_LOGIN_TYPE,
        identifier: {
            type: "m.id.user",
            user: user_id
        }
    }

    const headers = {
        Authorization: "Bearer " + process.env.MATRIX_AS_SECRET,
        "Content-Type": "application/json"
    }

    return axios.request({
        url: process.env.MATRIX_URL + "/_matrix/client/r0/login",
        headers,
        method: "POST",
        data: params,
        proxy: JSON.parse(process.env.PROXY),
        httpsAgent: new https.Agent({rejectUnauthorized: false})
    }).then(res => {
        return res.data.access_token
    })
}

const fetchOpenID1Token = async(username, access_token) =>
{

        const r1 = await axios.request({
            method: 'POST',
            url: process.env.MATRIX_URL + `/_matrix/client/r0/user/%40${username}%3A${process.env.MATRIX_SERVER_NAME}/openid/request_token`,
            headers: {
                "Authorization": `Bearer ${access_token}`,
                "Content-Type": "application/json"
            },
            proxy: JSON.parse(process.env.PROXY),
            data: {}
        })
        const openid1_token = r1.data.access_token
        return openid1_token

}


const stripIntercomCookies = async (proxyReq) => {
    const cookies = proxyReq.getHeader("cookie").split(";")
    var keep = cookies.filter(c => ! String(c).trim().startsWith("appSession"))
    proxyReq.setHeader('cookie', keep.join(';') )
}


module.exports.fetchToken = fetchToken
module.exports.fetchMatrixToken = fetchMatrixToken
module.exports.fetchOpenID1Token = fetchOpenID1Token
module.exports.stripIntercomCookies = stripIntercomCookies

