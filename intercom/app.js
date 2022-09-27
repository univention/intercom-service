/*
 * Simple Backend for the Browser: OIDC Login, some Methods to call
 */
require("dotenv").config({ path: "./.env.prod" });
const express = require("express");
var app = express();
app.set("view engine", "ejs");
const {
  auth,
  requiresAuth,
  attemptSilentLogin,
} = require("express-openid-connect");
const RedisStore = require("connect-redis")(auth);
const csrfDSC = require("express-csrf-double-submit-cookie");
const cookieParser = require("cookie-parser");
const jose = require("jose");

var cors = require("cors");

const { corsOptions, issuerBaseURL } = require("./config");

const {
  fetchMatrixToken,
  fetchOIDCToken,
  JWKS,
  redisClient,
} = require("./utils");

const {
  backchannelLogout,
  fs,
  nob,
  navigation,
  silent,
  uuid,
} = require("./routes");

const { 
  oidcVerifyDecodeAccessToken,
  oidcVerifyDecodeIdentityToken,
  refreshTokenIfNeeded,
  updateSessionState,
} = require("./middlewares");

const csrfProtection = csrfDSC({ cookie: { sameSite: "none", secure: true } });

app.use(express.urlencoded());

app.use(
  auth({
    // TODO; move to environ
    issuerBaseURL,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    authRequired: false,
    secret: process.env.SECRET,
    idpLogout: true,
    authorizationParams: {
      response_type: "code",
      scope: "openid offline_access",
    },
    session: {
      store: new RedisStore({ client: redisClient }),
    },
    afterCallback: async (req, res, session, decodedState) => {
      // TODO: Add some kind of error handling, if tokens can't be fetched the user should see an error message of some sort
      try {
        var ret = {};
        // fetch token for ox
        // TODO: check also if it's valid
        if (!("ox_access_token" in session)) {
          ret.ox_access_token = await fetchOIDCToken(
            session.access_token,
            `${process.env.OX_AUDIENCE}`
          );
        }

        const { payload } = await jose.jwtVerify(session.id_token, JWKS, {
          issuer: issuerBaseURL,
        });
        let uid = payload["entryuuid"];

        if (!uid) {
          console.log(
            "Sorry can't find the preferred username/uuid, maybe the mapping is missing?"
          );
        }

        if (!("matrix_access_token" in session)) {
          console.log("fetching matrix token");
          ret.matrix_access_token = await fetchMatrixToken(uid);
        }
      } catch (error) {
        console.log("Error fetching Tokens: " + error);
      }
      return { ...session, ...ret };
    },
  })
);

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(csrfProtection);
app.use(updateSessionState);
app.use(requiresAuth(), refreshTokenIfNeeded);

/**
 * Just a simple Endpoint to check if the service is there and for CORS testing
 */
app.get("/", function (req, res) {
  res.send("<p>Hello</p>");
});

/**
 * @name /backchannel-logout
 * @desc
 * OpenID Connect Backchannel Logout implementation to delete the session from the store
 */
app.use("/backchannel-logout", backchannelLogout);

/**
 * @name /nob/
 * @desc
 * Proxy for the Nordeck Bot (or just the plain Matrix UserInfo Service in testing).
 * Adds the proper Authorization Header
 */
app.use("/nob", requiresAuth(), csrfProtection.validate, oidcVerifyDecodeAccessToken, nob);

/**
 * @name /fs/
 * @desc
 * Proxy for Nextcloud.
 * Adds the proper Authorization Header
 * @example PROPFIND http://ic.p.test/fs/remote.php/dav/files/usera1/Photos
 *
 */
app.use("/fs", requiresAuth(), oidcVerifyDecodeAccessToken, fs);

/**
 * @name /navigation.json
 * @desc
 * Proxy to the portal for global Navigation Data.
 * Adds the proper Authorization Header
 */
app.use("/navigation.json", requiresAuth(), oidcVerifyDecodeAccessToken, oidcVerifyDecodeIdentityToken, navigation);

/**
 * @name /silent
 * @desc
 * Performs a "silent login", eg logs the user into the intercom service without interaction
 * if the user is already logged in to keycloak.
 *
 * Reports the Session Status via window.postmessage (JSON: {"loggedIn": true})
 */
app.use("/silent", attemptSilentLogin(), oidcVerifyDecodeAccessToken, silent);

/**
 * @name /uuid
 * @desc returns the uuid of the logged in user
 */
app.use("/uuid", requiresAuth(), oidcVerifyDecodeIdentityToken, uuid);

var server = app.listen(process.env.PORT, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.info("Intercom app listening at http://%s:%s", host, port);
});
