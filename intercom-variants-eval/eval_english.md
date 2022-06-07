# Misc
https://www.moesif.com/blog/api-engineering/api-gateways/Open-Source-API-Gateway-Roundup/
https://www.express-gateway.io/
https://geekflare.com/api-gateway/#geekflare-toc-express-gateway

## 1. Anforderungen an den Intercomservice definieren
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
## 7. Assessment and Recommendation
## 8. Definition of Implementation Steps for the recommended Solution

# Candidates
## Lura (KrakenD)
Similar Concept as our Intercom Service but in Go. Makes heavy use of the Gin Framework (as we do of Express) 
but seems to implement it's own proxy (the docs are not very precise on this, the future will tell) 

A major difference seems to be that Lura can combine multiple Backend Request into one with sophisticated 
error handling. Atm, I don't see any use for that in phoenix but it's nice to know/have.


