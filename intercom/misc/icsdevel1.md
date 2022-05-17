# Anpassungen
l. 116 (ics): Zeile löschen:    http-response set-header Access-Control-Allow-Origin "https://webmail.dpx-icsdevel1.at-univention.de"
(ics macht seine eigenen header)


Da es eingeschaltet sind nehme ich ROPG  

# Keycloak Config aufräumen

* Alle default scopes und additional scopes für alle clients wegschmeißen
* neuen scope "phoenix" erstellen, mapper für preferred_username, entryuuid, ... einbauen (alles was jedes phoenix system bekommt)
* Alle mapper für alle clients wegschmeißen außer context für ox
* 
