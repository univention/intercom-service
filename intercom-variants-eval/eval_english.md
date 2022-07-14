# Misc
* https://www.moesif.com/blog/api-engineering/api-gateways/Open-Source-API-Gateway-Roundup/
* https://www.express-gateway.io/
* https://geekflare.com/api-gateway/#geekflare-toc-express-gateway

## 1. Requirements of the intercom service
* Extendability (either in code or plugin interface)
* Proxy 
  * with Path rewrite and Request/Response manipulation
  * for complete backends, not per request (nneds implementation on Vendor side)
* CSRF Protection for cross-service requests
* OIDC SSO with FOSS OIDC module or own implementation
  * we don't need dynamic Client Registration, ... It's just a confidential client.
  Maybe OAuth Integration with minor tweaks is sufficient?
* OIDC SLO
  * welcher?
* silent login
* CORS Header and Cookie Flag manipulation
* HTTP Client to access the Keycloak Token Exchange
* Credential Storage (Vault, ... for saving credentials for Keycloak, Synapse, ...)
* BFF? Mobile?  
* Dev Process? Blue/Green, Canary, ... ?
* What about Vendor Lock-in? If we build the ics as a plugin for an API-Gateway, it might prove
difficult to switch to an alternative API Gateway implementation later.

## 2. Phoenix Requirements (Product Vision und -goals)
The Cross-Service Communication should be transparant for the Apps. Credentials must not be stored
in the browser (except for encrypted cookies) and should not be stored in the Apps (with the exception
of backend to backend communication)

The exponential growth of effort when "every service is talking to every other service" should be liearized;
every service is now talking to the intercom.

### Requirements for a Production Release
#### Organisational
* Security review by a third party for concept and final deliverable (for Example Dataport Security Operations Center) 
  * Schutzbedarf Feststellen und entsprechend Sicherheitskonzept, Grobkonzept, Feinkonzept, ...
  * Decision whether to use refresh tokens
  * Token Lifecycle: TTL, ...
  * Analyse Silent Login / window.postMessage Origin Checks
  * Decision whether we stick with stateless sessions or switch to stateful sessions
  * CORS Options (are these complete / do they pose any risks)
  * X-FRAME / Anti Clickjacking Options?
  * Define a minimal set of Cookie Flags
  * Token Exchange Permissions
  * Token checks on ics client side / how and what does ics validate in the id token
  * Audience / further restrictions for the exchanged tokens
  * Review Keycloak config (at least for the intercom client config, the token cleanup is another review?)
  * Do we have to take special measures against Session Riding?
  * Analyse potential "Cookie Apocalypse" Impact (changing support of 3rd Party Cookies in Browsers)
* GDPR / DSGVO Compliance / Review / Documents (this processes and distributes a bunch of personal data)
* Architecture Review
* Code Review
* Quality Assurance (QA)
* Performance Tests / Requirements

#### Implementation
* Session Management (currently we're just running the express default)
  * Implement XSRF / CSRF Protection
  * "Sperrliste" Implications (how to deny a user access in a timely manner)?
  * "Stateless logout" Problem, we need a centralised list of invalidated sessions. Or we have to change the session handling.
  * Implement Single Logout Implementation (since there is no logout button for the intercom, the user has no possibility
    to end their session)
* Concept for HA
  * how to deploy multiple ics
  * test that it actually works
  * how is failover achieved, what happens if one instance dies?
  * how is a session ended on all nodes?
  * ...
* Usual Chores
  * Implement Secure Storage for secrets (vault, ...)
  * Implement thorough checks for input data 
  * Implement (more) error Handling
  * Implement General Logging
  * Implement Audit Logging for Auth
  * Implement Monitoring
  * Remove debug / test helpers (like the token leak by design, logging tokens, ...)
  * Refine Header Massaging for Matrix (seems to work fine but we never talked about it with element/nordeck)
  * Protection against DoS?
  * Enforce TLS. How / where is what terminated (atm we're ignoring certificate errors at some points)
  * Documentation for Admins
  * Packaging
  * Creation / Hardening of a Container / Host / ... (atm this is running on the "everything else" host)
  * EOL Documentation / What to do to remove the service from the stack after it is not needed anymore.
* Testing
  * There are extensive, automated e2e tests for the intercom. The original Plan was to use the nodejs implementation for developing 
said test cases and then use the test cases for developing/testing the final intercom implementation (as an api gateway)
plugin or whatever)
  * The tests require a full phoenix stack and thusly integration into an automated test chain
might proof difficult (bc the stack needs a bunch of VMs and takes hours to delopy)

## 3. Vendor Perspective
Intercom vs API Gateway Integration, is an API Gateway Mode for the Backends an Alternative?

https://medium.com/api-integration-essentials/api-gateway-vs-microgateway-microservices-gateway-e8fbbd8ba9c0
## 4. Architectural Perspective
The main goal of Phoenix is to combine existing Software in a way that the user experiences it as one piece of software.
The user logs in once, is logged-in in every App and can for example attach files from nextcloud to ox emails.

The main challenge is to manage the changes required to combine these existing Apps.  

### Current approach: Intercom Service for Cross Service Communication

### Alternative: 

## 5. Non functional Requirements
* Performance
* Security 
* Open Source License / OSI Approved
* Scalability

## 6. Possible Candidates for the Analysis
* Kong
* Tyk
* Fusio: https://www.fusio-project.org
* Traefik API Gateway (sadly Enterprise only)
* Lura
* KrakenD Open Source (ggfs in Verbindung mit eigenen Lura Modulen)
* https://github.com/ExpressGateway/express-gateway (deprecated / looking for Maintainer https://www.express-gateway.io)
* Current Implementation: http-proxy-middleware, express, express-openid-connect
## 7. Assessment and Recommendation
## 8. Definition of Implementation Steps for the recommended Solution

# Candidates
There is basically two different Groups of Candidates. API Gateways and Frameworks mostly centered around proxying and OIDC.

Since it is quite clear from the beginning that the restrictions of the FOSS Versions will be a major factor, this is done
as an exploratory evaluation, i.e. I stop evaluating if I hit a major snag. 
## API Gateways
### KrakenD
Similar Concept as our Intercom Service but in Go. Makes heavy use of the Gin Framework (as we do of Express) 
but seems to implement it's own proxy (the docs are not very precise on this, the future will tell) 

A major difference seems to be that Lura can combine multiple Backend Request into one with sophisticated 
error handling. Atm, I don't see any use for that in phoenix but it's nice to know/have.

Lura itself does not provide OAuth/OIDC Functionality, so we'd look at KrakenD CE (Community Edition)

https://www.krakend.io/assets/KrakenD-EE-vs-CE--feature-matrix.pdf

There is a a ton of convenience features missing in CE. Notable other missing features:
* support
* OpenAPI Importer (do we need this if we proxy whole APIs?)
* End to End Testing Tool (probably not needed)
* "Let clients follow redirects" (what does this mean?)
* Basic Auth & API Key (luckily we don't need this.)
* Multiple IdPs per Endpoint (we don't need this)
* Token revocation client (might be an issue)
* Websockets, gRPC, SOAP (this might be a major issue)
* limited rate limiting (out of scope for the intercom)
* IP Filtering (out of scope for the intercom)
* URL rewrite (to be investigated, currently used for central nav)
* Virtual Hosts (probably not needed)
* some logging implementations (not needed, the important ones are there)

#### KrakenD Problems
* No Wildcards really means we have to config every single request. 
* Also, there is no OpenAPI Config generated.
* OAuth is only client credentials for a service account (i.e. krakend logs into keycloak and tells 
the upstream apps that it is krakend)
* KrakenD seems not to support hiding credentials from the client.
* Transportation of a jwt in cookies is possible https://github.com/krakendio/krakend-ce/issues/515

#### KrakenD Conclusion
KrakenD (or lua for this matter) could be used in addition to an ics or every bit of the current ics
has to be implemented in KrakenD (silent login, oidc, proxying whole APIs, ...). 
I will stop the evaluation at this point. 

### Kong
The Kong Community Edition is also missing quite some features, some noteworthy ones:

* Admin GUI
* GraphQL
* Advanced Caching 
* Advanced Rate Limiting
* Enterprise Grade Auth (Full OAuth 2.0, OpenID Connect, Vault, Mutual TLS, JWT Signing/Resigning, full LDAP)
* RBAC
* OPA
* Web Hooks
* Support (obviously)

#### Kong Problems
* The integrated OAuth Module seems useless since it acts as an IdP instead of connecting to one?
* The Kong Inc OIDC Module is only available in the commercial version
* The free and formerly abandoned Community OIDC Module seems to have been picked up by the 
bulgarian company "revomatico": https://github.com/revomatico/kong-oidc

#### Kong Conclusion
Even with the free oidc module, there is still plenty to develop. As KrakenD, this is can either be used in addition 
to an ics or all the ics functionality has to be implemented as lua plugins

### Tyk
Tyk has a plugin interface for different languages like python and go. Tyk uses redis as a session store and auth plugins
can access / change the store. So it seems possible to write two plugins, one post-auth to 

Tyk claims to really commit to open source and not open core. This seems to be the case. The benefit of
the paid version is a frontend to set stuff up and support. The free docs are extensive but sometimes 
misleading or spread all over the place. See the python plugin for example, if you know there's a bug
and it only runs as a bundle it makes sort sense to just cut the non bundle part from the docs. But you
still find plenty of tutorials describing the broken way and all you get is a weird error message. Stuff 
like costs a lot of time to figure out.

https://tyk.io/open-source/
#### Install python plugin
```docker-compose exec tyk-gateway /bin/bash```

```apt install python3 python3-dev python3-pip build-essential```

Seems python plugins from filesystem are broken for a long time, so let's try bundle.

The (python) bundle process is convoluted af, create a bundle with the cli tool, upload it to a webserver, tell tyk to fetch the bundle,
delete the local cached copy of the bundle in tyk and restart tyk. This is not conducive to fast development at all.

Alternative: Go plugin. The native language of tyk.

#### Tyk go plugin
The plugin process has a bunch of stuff to consider but seems feasible. The plugin has to be compiles
with a special docker image for the exact Version of tyk. If tyk and the plugin use the same libs, the 
version tyk is using must be used. Changes in the plugin at least require a compile and restart.

At first glance, the plugin API seems to provide all features we need. This has to be investigated further.
#### Tyk OIDC
Can tyk only do bearer tokens with oidc/oauth and not generate a session with an authorization code flow.
The community might be inclined to implement a sort of Token Handler/BFF Pattern
https://community.tyk.io/t/tyk-as-a-backend-for-frontend-bff-token-handler-for-single-page-apps-spa/5513

#### Tyk Conclusion
Strong contender, sadly missing needed features like OIDC & Sessions.


### Fusio
Written in PHP. More of an API Management Plattform i.e. providing monetization. 
Plenty of unused features (possible attack vectors). Also Fusio seems to be centered around the "per request"
pragma, there is no indication in the manual that wildcards are supported.


It seems does not support OIDC and OAuth support is very rudimentary, only the client credentials
flow is supported. 

https://docs.fusio-project.org/docs/use_cases/invoke_protected_route/

## API Gateways Conclusion
API Gateways seem to have two major problems: Critically limited functionality in the FOSS Versions and vendor lock-in.
If we implement the intercom as a plugin for any API Gateway, we are bound to that Gateway und it's Interface. If
we implement features which are missing in the FOSS Version this lock-in gets more severe. Since API Gateways are a rather
new trend and there are still new concepts coming up (like BFF, Token Handler, OAuth 3, FIDO2, ...). 

Also, most API Gateways are either build for piggybacking on an existing oidc/oauth implementation 
(just check bearer tokens are there) or to replace the auth in an app (inject username, ... via header parameter)

So it seems possible to use any API Gateway in conjuncture with an intercom with virtually no added complexity. The intercom
is just a service like all other services behind the API gateway. Or it is used without an API Gateway. Thusly, it seems
much more sensible to seperate the functionalities and not commit on a vendor/product as (comparatively) early adopters. 
Depending on how Policies around API Gateways develop, it might be possible that certain customers are bound to a product
(like pay for Apigee and use it for everything) and are not able/willing to run different API Gateways.
## Frameworks
### Current Implementation: nodejs, http-proxy-middleware, express, express-openid-connect
NodeJS was made for parallel request performance, so it is not surprising that there is a powerful proxying library available.
Since it's also a staple in web development there is also an oidc library maintained by the experts at auth0.

### Lura (the KrakenD Core)
A go based "API Gateway builder". 

## Service Mesh?
Univention is planning to integrate a Service Mesh into UCS (currently looking at Kuma) to make the configuration
of distributed systems more convenient. This has no direct impact for the current intercom implementation 
(basically the URLs in the config change from some FQDN to localhost:someport). But it might save some efford with
certificate checks and such. Also Kuma is a Standalone Open Source Project, it seems that Kong Enterprise combines
Kong and Kuma.

# Learnings
## API Gateway / Management Different Approaches
There are Gateways which offload the Auth from the Application. For example Kong allows 
the user to login via OIDC, get a session managed by kong. Other Gateways, like Tyk for example,
take a more proxy orientated approach: The OIDC/OAuth login and session management is managed outside of
tyk but you can configure tyk to inspect requests and to deny requests which do not contain
the proper Bearer Token.

Also most API Management Solutions seem not to be aimed at SPAs without a backend. The rather expect a classic 
frontend/backend combo which then uses a third party application via the backend.

# CSRF / XSRF Protection
## Abstract
The intercom backend is accessed by another frontend. This is technically the same strategy used in
Cross-Site Request Forgeries: A potential malicious site embeds calls to a backend and the browser unknowingly
attaches the session credentials to the request. To mitigate this risk, there are different possibilities.

Do we need XSRF Protection at all / which endpoints do need protection? Mostly the Apps should cover their own
XSRF because there is no real difference between the ics and a proxy. Or is XSRF Protection some feature which we
can offload.

## XSRF Protection Strategies
We need an unpredictable secret for at least the session or ideally every single request. These are normally 
incorporated in hidden fields.

https://www.allianz-fuer-cybersicherheit.de/SharedDocs/Downloads/Webs/ACS/DE/BSI-CS/BSI-CS_022.pdf
https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html

The silent login could be used to either incorporate a hidden field or use the postMessage System to deliver
rotating keys. Storing the secret serverside might be difficult, maybe we could use something like a MAC or some
signing.

Is a protection possible without vendor interaction? Probably not...

PoC ToDo: 
* get ics, ox fake and keycloak env running locally (since no test env is available atm)
* protect oxfake against csrf
* list all ics endpoints and decide whether they need protection / document how the are protected.
** / (main route), GET: "Hello World", not needed
** /nob (nordeck bot), All Methods: No XSRF Protection on Nordeck Side bc auf Bearer Auth.
** /fs (nextcloud):All Methods, TBD
** /navigation.json, GET or All Methods?: Probably not needed
** /silent: Keycloak silent login, XSRF handled by keycloak?
** /uuid, GET: no sideeffects, not needed
** /tokenleak debug only, to be removed


## Risks
Silent login XSRF
