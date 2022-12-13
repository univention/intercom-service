const axios = require("axios");
const qs = require("qs");
const { logger } = require("./logger");

const fetchOIDCToken = async (access_token, audience) => {
  var params = {
    grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
    subject_token: access_token,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    audience: audience,
  };
  
  return axios
    .request({
      url:
          (process.env.ISSUER_BASE_URL ??
            `${process.env.KEYCLOAK_URL}/auth/realms/${process.env.REALM_NAME}`) +
          "/protocol/openid-connect/token",
      method: "POST",
      data: qs.stringify(params),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      proxy: JSON.parse((process.env.PROXY ?? "false").toLowerCase()),
    })
    .then((res) => {
      return res.data.access_token;
    })
    .catch((err) => {
      logger.error(`Error fetching OIDC token for ${audience}`);
      logger.debug(err);
    });
};

module.exports = {
  fetchOIDCToken,
};