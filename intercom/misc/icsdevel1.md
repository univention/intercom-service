# Anpassungen
l. 116 (ics): Zeile löschen:    http-response set-header Access-Control-Allow-Origin "https://webmail.dpx-icsdevel1.at-univention.de"
(ics macht seine eigenen header)


Da es eingeschaltet sind nehme ich ROPG  

# Keycloak Config aufräumen

vorweg: preferred_username fliegt raus da lt standard teil vom profile scope den bisher kein client braucht.
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
