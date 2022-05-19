# Anpassungen
l. 116 (ics): Zeile löschen:    http-response set-header Access-Control-Allow-Origin "https://webmail.dpx-icsdevel1.at-univention.de"
(ics macht seine eigenen header)


Da es eingeschaltet sind nehme ich ROPG  

# Keycloak Config aufräumen

Vorweg: preferred_username fliegt raus da lt standard teil vom profile scope den bisher kein client braucht.
Wg Datensparsamkeit also keinen profile scope anfragen, ein mapper mit dem selben namen außerhalb des scopes
führt zu verwirrung und ggfs mapper races. Ergo: aus preferred_username wird username.

* Alle default scopes und additional scopes für alle clients wegschmeißen
* identity provider mapper "preferred_username" auf "phoenix_username" umbauen (also uid->username)
* neuen scope "phoenix" erstellen, mapper für username und entryuuid einbauen (alles was jedes phoenix system bekommt)
* Alle mapper für alle clients wegschmeißen außer context für ox
* audience mapper "intercom" für intercom (damit die intercom tokens nicht von diensten missbraucht werden können falls
* sync mode von identitiy provider auf "force" stellen? (import schreit nach fehlern wg veraltetem zeug)
* token lifetime (unter zB oxoidc advanced settings auf 8h stellen)

* username feld wird von keycloak benutzt und auf lower case gesetzt. nicht benutzen, sonst witzige Fehler. 
  * ggfs mappen um user in keycloak besser greifen zu können?

* TODO profile bei matrix aus den angefragten scopes werfen


Stand jetzt: 

Token Mapper

* intercom
  * Audience
* matrix
  * none
* ncoidc
  * context (deprecated, delete when intercom is used for ox access)
* oxoidc
  * context

scopes & mappers:
* phoenix
  * phoenix_username
  * entryUUID
* phoenix_legacy (deprecated, delete when preferred_username is renamed to phoenix_username throughout the stack)
  * preferred_username


Benefits / solved Problems:
* preferred_username is defined in the spec as part of the profile scope. The profile scope provides a bunch 
of other unused claims. 
  * GPDR Problem. 
  * Mapper Race if we map it outside of the scope (two mappers mapping the same thing with the same priority)
  * confusion / ignoring the spec if we remove it from the profile scope
* username is an attribute used by keycloak as the username. Keycloak converts it to lowercase.
  * massive confusion avoided bc of sneaky conversion
* Mappers deduplicated
  * deleted 25 mappers without loosing functionality
* We now can bind scopes to roles. If a non-phoenix user requests the phoenix scope, they are rejected
  * Possibility to use the IdP for non phoenix related auth
  * Possibility to restrict access to certain services to certain groups / roles (for example admins for
monitoring services or teachers for grading / recording grades))
* shrunk token size significantly
