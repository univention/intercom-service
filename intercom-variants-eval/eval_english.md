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
* CORS Header setzen und ggfs Cookie Flags
* HTTP Client um die Keycloak Token Exchange zu bedienen
* Credential Storage (Vault, ... zum Speichern der Zugangsdaten zu Keycloak, Synapse, ...)
* BFF? Was ist eigentlich mit Mobile?
* Dev Prozess? Blue/Green, Canary, ... ?

## 2. Anforderungen von Phoenix (Produktvision und -ziele)
Die Cross Service Kommunikation soll für die einzelnen Dienste möglichst Transparent laufen. 
Credentials sollen weder im Browser landen noch bei den einzelnen Diensten (soweit möglich).
Das expondentielle Wachstum von "jeder Dienst spricht mit jedem soll" soll entschärft werden, 
jeder Dienst spricht nicht mit jedem anderen sondern lediglich mit dem Intercom.
## 3. Sicht der Hersteller
Intercom vs API Gateway Integration, also API Gateway Mode für die Backends als zusätzliche Auth
https://medium.com/api-integration-essentials/api-gateway-vs-microgateway-microservices-gateway-e8fbbd8ba9c0
Letztlich prüfen die Anwendungen ja auch nur ein Header Feld (Cookie), dann wird halt ein anderes geprüft 
und das auch nur bei login.
## 4. Sicht der Architektur


## 5. Nichtfunktionale Anforderungen
* Performance
* Sicherheit 
* Open Source Lizenz
* Skalierbarkeit

## 6. Produktauswahl für die Analyse erstellen
* Kong
* Tyk
* Lura
* KrakenD Open Source (ggfs in Verbindung mit eigenen Lura Modulen)
* 
## 7. Abwägung und Empfehlung
## 8. Definition der Umsetzungsschritte für die empfohlene Variante

# Candidates
## Lura (KrakenD)
Similar Concept as our Intercom Service but in Go. Makes heavy use of the Gin Framework (as we do of Express) 
but seems to implement it's own proxy (the docs are not very precise on this, the future will tell) 

A major difference seems to be that Lura can combine multiple Backend Request into one with sophisticated 
error handling. Atm, I don't see any use for that in phoenix but it's nice to know/have.


