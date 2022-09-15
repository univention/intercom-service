require("dotenv").config({ path: "./.env.prod" });
const axios = require("axios");
const qs = require("qs");
const https = require("https");
const cookie = require("cookie");
const jose = require("jose");

const fetchToken = async (access_token, audience) => {
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
    });
};

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

const stripIntercomCookies = async (proxyReq) => {
  const cookies = cookie.parse(proxyReq.getHeader("cookie"));
  delete cookies["appSession"];
  if (Object.keys(cookies).length > 0) {
    const keep = Object.keys(cookies).map((c) =>
      cookie.serialize(c, cookies[c])
    );
    proxyReq.setHeader("cookie", keep.join("; "));
  }
};

const massageCors = async (req, proxyRes, allowedRegEx) => {
  const origin = req.get("origin");
  if (origin && origin.match(allowedRegEx)) {
    proxyRes.headers["access-control-allow-origin"] = origin;
  }
};

const verifyJWT = async (token, issuerBaseURL, jwks) => {
  const { payload, protectedheader } = await jose.jwtVerify(
    // decode and validates claims set
    token,
    jwks,
    {
      issuer: issuerBaseURL,
    }
  );
  return payload;
};

module.exports = {
  fetchToken,
  fetchMatrixToken,
  stripIntercomCookies,
  massageCors,
  verifyJWT,
};

/*
 * module.exports.fetchToken = fetchToken
 * module.exports.fetchMatrixToken = fetchMatrixToken
 * module.exports.stripIntercomCookies = stripIntercomCookies
 * module.exports.massageCors = massageCors
 */
