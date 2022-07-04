# Misc
* https://www.moesif.com/blog/api-engineering/api-gateways/Open-Source-API-Gateway-Roundup/
* https://www.express-gateway.io/
* https://geekflare.com/api-gateway/#geekflare-toc-express-gateway

## 1. Requirements of the intercom service
* Extendability (either in code or plugin interface)
* Proxy 
  * with Path rewrite and Request/Response manipulation
  * for complete backends, not per request
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

#### Install python plugin
```docker-compose exec tyk-gateway /bin/bash```

```apt install python3 python3-dev python3-pip build-essential```

Seems python plugins from filesystem are broken for a long time, so let's try bundle.

The (python) bundle process is convoluted af, create a bundle with the cli tool, upload it to a webserver, tell tyk to fetch the bundle,
delete the local cached copy of the bundle in tyk and restart tyk. This is not conducive to fast development at all.

Alternative: Go plugin. The native language of tyk.

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

### 
