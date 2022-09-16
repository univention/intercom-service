/*
 * Simple Backend for the Browser: OIDC Login, some Methods to call
 */

// Ask providers if there's any ouath in the stack. Oauth as in "I have an access token provided by keycloak and can do stuff via REST, ..."
require("dotenv").config({ path: "./.env.prod" });
const path = require("node:path");
const express = require("express");
var app = express();
app.set("view engine", "ejs");
const { createProxyMiddleware } = require("http-proxy-middleware");
const {
  fetchMatrixToken,
  fetchToken,
  stripIntercomCookies,
  massageCors,
  verifyJWT,
} = require("./helpers");
const {
  auth,
  requiresAuth,
  attemptSilentLogin,
  claimEquals,
} = require("express-openid-connect");
const csrfDSC = require("express-csrf-double-submit-cookie");
const cookieParser = require("cookie-parser");
const jose = require("jose");

const { createClient } = require("redis");
const RedisStore = require("connect-redis")(auth);

var cors = require("cors");

var corsOptions = {
  methods: "GET,POST,PUT,DELETE,PROPFIND,MKCOL",
  credentials: true,
  // TODO: can we drop Authorization?
  exposedHeaders: [
    "etag",
    "dav",
    "Content-Security-Policy",
    "Location",
    "Authorization",
    "depth",
    "content-type",
    "ocs-apirequest",
  ],
  origin: new RegExp(process.env.ORIGIN_REGEX),
};

const csrfProtection = csrfDSC({ cookie: { sameSite: "none", secure: true } });
const issuerBaseURL =
  process.env.ISSUER_BASE_URL ??
  `${process.env.KEYCLOAK_URL}/auth/realms/${process.env.REALM_NAME}`;
const JWKS = jose.createRemoteJWKSet(
  new URL(
    path
      .join(issuerBaseURL, "/protocol/openid-connect/certs")
      .replace(/\\/g, "/")
      .replace(":/", "://")
  )
);

app.use(express.urlencoded());
let redisClient = createClient({
  legacyMode: true,
  url: `redis://default:${process.env.REDIS_PASSWORD}@redis-intercom:6379`,
});
redisClient.connect().catch(console.error);

const oidcVerifyDecodeAccessToken = async (req, res, next) => {
  try {
    req.decodedAccessToken = await verifyJWT(
      req.appSession.access_token,
      issuerBaseURL,
      JWKS
    );
    next();
  } catch (error) {
    console.error("Error verifying OIDC Access Token", error);
    res.status(401).send();
  }
};

const oidcVerifyDecodeIdentityToken = async (req, res, next) => {
  try {
    req.decodedIdToken = await verifyJWT(
      req.appSession.id_token,
      issuerBaseURL,
      JWKS
    );
    next();
  } catch (error) {
    console.error("Error verifying OIDC Identity Token", error);
    res.status(401).send();
  }
};

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
          ret.ox_access_token = await fetchToken(
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
app.use((req, res, next) => {
  if (
    req.cookies &&
    "appSession" in req.cookies &&
    req.appSession &&
    "session_state" in req.appSession
  ) {
    redisClient.set(req.appSession["session_state"], req.cookies["appSession"]);
  }
  next();
});
app.use(requiresAuth(), async (req, res, next) => {
  try {
    let { token_type, access_token, isExpired, refresh } = req.oidc.accessToken;
    if (isExpired()) {
      ({ access_token } = await refresh());
      req.appSession.access_token = access_token;
      console.log("Refreshing expired token");
    }
  } catch (err) {
    console.error("Refreshing expired token failed", err);
  }
  next();
});

/**
 * @name /backchannel-logout
 * @desc
 * OpenID Connect Backchannel Logout implementation to delete the session from the store
 */
app.post("/backchannel-logout", async (req, res) => {
    const { payload, protectedHeader } = await jose.jwtVerify(  // decode and validates claims set
        req.body.logout_token,
        JWKS,
        {
            issuer: issuerBaseURL,
            // maxTokenAge: "10 seconds"  // to avoid replay attack too far after issued_at
        }
    );
    redisClient.get( payload['sid'], function(err, session_id) {
        redisClient.del("sess:" + session_id)
        redisClient.del(payload['sid'])
        res.send("Done")
    });
    /*
    * redisClient.destroy(payload.sid, (err) => {
    *   console.error("Could not destroy session", err);
    * });
    */
});

/**
 * Just a simple Endpoint to check if the service is there and for CORS testing
 */
app.get("/", function (req, res) {
  res.send("<p>Hello</p>");
});

/**
 * @name /nob/
 * @desc
 * Proxy for the Nordeck Bot (or just the plain Matrix UserInfo Service in testing).
 * Adds the proper Authorization Header
 */
app.use(
  "/nob",
  requiresAuth(),
  csrfProtection.validate,
  oidcVerifyDecodeAccessToken,
  createProxyMiddleware({
    target: process.env.NORDECK_URL,
    logLevel: "info",
    changeOrigin: true,
    pathRewrite: { "^/nob": "" },
    secure: false,
    onProxyReq: function onProxyReq(proxyReq, req, res) {
      stripIntercomCookies(proxyReq);
      // TODO: Build Switch for Nordeck Live Mode
      // Example headers.set('authorization', `MX-Identity ${btoa(JSON.stringify(t))}`);
      // or  proxyReq.setHeader('authorization', `Bearer ${matrix_access_token}`);

      if (req.appSession.matrix_access_token) {
        proxyReq.setHeader(
          "authorization",
          `Bearer ${req.appSession.matrix_access_token}`
        );
      }
    },
    onProxyRes: function (proxyRes, req, res) {
      // TODO: Matrix seems to be specific with it's headers, we have to decide whether to steamroll or to massage...
      massageCors(req, proxyRes, corsOptions.origin);
    },
  })
);

/**
 * @name /fs/
 * @desc
 * Proxy for Nextcloud.
 * Adds the proper Authorization Header
 * @example PROPFIND http://ic.p.test/fs/remote.php/dav/files/usera1/Photos
 *
 */
app.use(
  "/fs",
  requiresAuth(),
  oidcVerifyDecodeAccessToken,
  createProxyMiddleware({
    target: process.env.NC_URL,
    logLevel: "info",
    changeOrigin: true,
    pathRewrite: {
      "^/fs": "",
    },
    onProxyReq: function onProxyReq(proxyReq, req, res) {
      // TODO: Service takes pretty much any token which is not good
      stripIntercomCookies(proxyReq);
      proxyReq.setHeader(
        "authorization",
        `Bearer ${req.appSession.ox_access_token}`
      );
    },
    onProxyRes: function (proxyRes, req, res) {
      massageCors(req, proxyRes, corsOptions.origin);
    },
  })
);

/**
 * @name "/portal.json (without silly quotes for jsdoc)"
 * @desc
 * Proxy to the portal for global Navigation Data.
 * Adds the proper Authorization Header
 */
// TODO: https://127.0.0.1/univention/portal/navigation.json?lang=de_DE -H "Authorization: Basic username:MyPortalSecretFromBMIUXAnsibleHostINI"
app.use(
  "/navigation.json",
  requiresAuth(),
  oidcVerifyDecodeAccessToken,
  oidcVerifyDecodeIdentityToken,
  createProxyMiddleware({
    target: process.env.PORTAL_URL,
    logLevel: "info",
    changeOrigin: true,
    pathRewrite: { "^/navigation.json": "/univention/portal/navigation.json" },
    onProxyReq: function onProxyReq(proxyReq, req, res) {
      stripIntercomCookies(proxyReq);
      proxyReq.setHeader(
        "Authorization",
        "Basic " +
          btoa(
            req.decodedIdToken["phoenixusername"] +
              ":" +
              process.env.PORTAL_API_KEY
          )
      );
    },
    onProxyRes: function (proxyRes, req, res) {
      massageCors(req, proxyRes, corsOptions.origin);
    },
  })
);

/**
 * @name /silent
 * @desc
 * Performs a "silent login", eg logs the user into the intercom service without interaction
 * if the user is already logged in to keycloak.
 *
 * Reports the Session Status via window.postmessage (JSON: {"loggedIn": true})
 */
app.get(
  "/silent",
  attemptSilentLogin(),
  oidcVerifyDecodeAccessToken,
  (req, res) => {
    // TODO: Do proper postMessage reporting
    const sessionStatus = "access_token" in req.appSession;
    console.log(`Silent login, logged in ${sessionStatus}`);
    res.render("pages/silent", {
      sessionStatus,
      csrftoken: req.cookies["_csrf_token"],
    });
  }
);

/**
 * @name /uuid
 * @desc returns the uuid of the logged in user
 */
app.get("/uuid", requiresAuth(), oidcVerifyDecodeIdentityToken, (req, res) => {
  // TODO: wrong field, use username?
  let entryUUID = req.decodedIdToken["entryuuid"];
  res.send(entryUUID);
});

var server = app.listen(process.env.PORT, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.info("Intercom app listening at http://%s:%s", host, port);
});
