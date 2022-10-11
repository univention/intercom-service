const https = require("https");
const axios = require("axios");

const fetchMatrixToken = async (user_id) => {
  const params = {
    // https://spec.matrix.org/v1.4/client-server-api/#appservice-login
    type: "m.login.application_service",
    identifier: {
      type: "m.id.user",
      user: user_id,
    },
  };
  
  // https://spec.matrix.org/v1.4/application-service-api/#registration
  const headers = {
    Authorization: "Bearer " + process.env.MATRIX_AS_SECRET,
    "Content-Type": "application/json",
  };
  
  return axios
    .request({
      url: process.env.MATRIX_URL + "/_matrix/client/v3/login",
      headers,
      method: "POST", 
      data: params,
      proxy: JSON.parse((process.env.PROXY ?? "false").toLowerCase()),
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    })
    .then((res) => {
      return res.data.access_token;
    })
    .catch(err => console.log("Error fetching Matrix token", err));
};

module.exports = {
  fetchMatrixToken,
};