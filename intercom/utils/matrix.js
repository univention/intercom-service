const https = require("https");
const axios = require("axios");

const fetchMatrixToken = async (user_id) => {
  const params = {
    //type: "m.login.application_service",
    type: process.env.MATRIX_LOGIN_TYPE,
    identifier: {
      type: "m.id.user",
      user: user_id,
    },
  };
  
  const headers = {
    Authorization: "Bearer " + process.env.MATRIX_AS_SECRET,
    "Content-Type": "application/json",
  };
  
  return axios
    .request({
      url: process.env.MATRIX_URL + "/_matrix/client/r0/login",
      headers,
      method: "POST",
      data: params,
      proxy: JSON.parse((process.env.PROXY ?? "false").toLowerCase()),
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    })
    .then((res) => {
      return res.data.access_token;
    });
};

module.exports = {
  fetchMatrixToken,
};