{{/*
SPDX-FileCopyrightText: 2023 Univention GmbH
SPDX-License-Identifier: AGPL-3.0-only
*/}}
{{- define "intercom-service.fqdn" -}}
{{- if .Values.ingress.enabled }}
{{ .Values.ics.default.protocol }}://{{ .Values.ingress.host }}
{{- else }}
http://{{ include "common.names.fullname" $ }}:{{ $.Values.service.ports.http.port }}
{{- end }}
{{- end }}

{{- /*
PROVISIONING Keycloak
*/}}

{{- define "intercom-service.provisioning.config.keycloak.url" -}}
{{- if .Values.provisioning.config.keycloak.url -}}
{{ .Values.provisioning.config.keycloak.url -}}
{{- else if .Values.global.nubusDeployment -}}
{{ printf "http://%s-keycloak:8080/realms/%s" .Release.Name  (include "intercom-service.provisioning.config.keycloak.realm" .) }}
{{- else -}}
{{ required ".Values.provisioning.config.keycloak.url is required" .Values.provisioning.config.keycloak.url -}}
{{- end -}}
{{- end -}}

{{- define "intercom-service.provisioning.config.keycloak.realm" -}}
{{- if .Values.provisioning.config.keycloak.realm -}}
{{- .Values.provisioning.config.keycloak.realm -}}
{{- else if .Values.global.nubusDeployment -}}
{{- coalesce .Values.provisioning.config.keycloak.realm .Values.global.keycloak.realm "nubus" -}}
{{- else -}}
{{- required ".Values.provisioning.config.keycloak.realm must be defined." .Values.provisioning.config.keycloak.realm -}}
{{- end -}}
{{- end -}}

{{- define "intercom-service.provisioning.config.keycloak.username" -}}
{{- if .Values.provisioning.config.keycloak.username -}}
{{- .Values.provisioning.config.keycloak.username -}}
{{- else if .Values.global.nubusDeployment -}}
kcadmin
{{- else -}}
{{- required ".Values.provisioning.config.keycloak.username must be defined." .Values.provisioning.config.keycloak.username -}}
{{- end -}}
{{- end -}}

{{- define "intercom-service.provisioning.config.keycloak.credentialSecret.name" -}}
{{- if .Values.provisioning.config.keycloak.credentialSecret.name -}}
{{- .Values.provisioning.config.keycloak.credentialSecret.name -}}
{{- else if .Values.provisioning.config.keycloak.password -}}
{{ printf "%s-keycloak-credentials" (include "common.names.fullname" .) }}
{{- else if .Values.global.nubusDeployment -}}
{{- printf "%s-intercom-service-provisioning-secret" .Release.Name -}}
{{- else -}}
{{ required ".Values.provisioning.config.keycloak.password must be defined." .Values.provisioning.config.keycloak.password}}
{{- end -}}
{{- end -}}

{{- define "intercom-service.provisioning.config.keycloak.credentialSecret.key" -}}
{{- if .Values.provisioning.config.keycloak.credentialSecret.key -}}
{{- .Values.provisioning.config.keycloak.credentialSecret.key -}}
{{- else if .Values.global.nubusDeployment -}}
adminPassword
{{- end -}}
{{- end -}}

{{- define "intercom-service.provisioning.config.keycloak.password" -}}
{{- if .Values.provisioning.config.keycloak.credentialSecret.name -}}
valueFrom:
  secretKeyRef:
    name: {{ .Values.provisioning.config.keycloak.credentialSecret.name | quote }}
    key: {{ .Values.provisioning.config.keycloak.credentialSecret.key | quote }}
{{- else if .Values.global.nubusDeployment -}}
valueFrom:
  secretKeyRef:
    name: {{ include "intercom-service.provisioning.config.keycloak.credentialSecret.name" . | quote }}
    key: {{ .Values.provisioning.config.keycloak.credentialSecret.key | quote }}
{{- else -}}
value: {{ required ".Values.provisioning.config.keycloak.password is required." .Values.provisioning.config.keycloak.password | quote }}
{{- end -}}
{{- end -}}

{{- define "intercom-service.provisioning.config.keycloak.connection.protocol" -}}
{{- if .Values.provisioning.config.keycloak.connection.protocol -}}
{{- .Values.provisioning.config.keycloak.connection.protocol -}}
{{- else -}}
http
{{- end -}}
{{- end -}}

{{- define "intercom-service.provisioning.config.keycloak.connection.host" -}}
{{- if .Values.provisioning.config.keycloak.connection.host -}}
{{- .Values.provisioning.config.keycloak.connection.host -}}
{{- else if .Values.global.nubusDeployment -}}
{{- printf "%s-keycloak" .Release.Name -}}
{{- else if not .Values.provisioning.config.keycloak.connection.baseUrl -}}
{{- required ".Values.provisioning.config.keycloak.connection.host must be defined." .Values.provisioning.config.keycloak.connection.host -}}
{{- end -}}
{{- end -}}

{{- define "intercom-service.provisioning.config.keycloak.connection.port" -}}
{{- if .Values.provisioning.config.keycloak.connection.port -}}
{{- .Values.provisioning.config.keycloak.connection.port -}}
{{- else -}}
8080
{{- end -}}
{{- end -}}

{{- define "intercom-service.provisioning.config.keycloak.connection.baseUrl" -}}
{{- if .Values.provisioning.config.keycloak.connection.baseUrl -}}
{{- .Values.provisioning.config.keycloak.connection.baseUrl -}}
{{- else if .Values.global.nubusDeployment -}}
{{- $protocol := include "intercom-service.provisioning.config.keycloak.connection.protocol" . -}}
{{- $host := include "intercom-service.provisioning.config.keycloak.connection.host" . -}}
{{- $port := include "intercom-service.provisioning.config.keycloak.connection.port" . -}}
{{- printf "%s://%s:%s" $protocol $host $port -}}
{{- else -}}
{{- required ".Values.provisioning.config.keycloak.connection.baseUrl must be defined." .Values.provisioning.config.keycloak.connection.baseUrl -}}
{{- end -}}
{{- end -}}

{{- define "intercom-service.provisioning.config.ics_client.credentialSecret.name" -}}
{{- if .Values.provisioning.config.ics_client.credentialSecret.name -}}
{{- .Values.provisioning.config.ics_client.credentialSecret.name -}}
{{- else if .Values.global.nubusDeployment -}}
{{- printf "%s-intercom-service-provisioning-secret" .Release.Name -}}
{{- end -}}
{{- end -}}

{{- define "intercom-service.provisioning.config.ics_client.credentialSecret.key" -}}
{{- if .Values.provisioning.config.ics_client.credentialSecret.key -}}
{{- .Values.provisioning.config.ics_client.credentialSecret.key -}}
{{- else if .Values.global.nubusDeployment -}}
icsClientSecret
{{- end -}}
{{- end -}}

{{- define "intercom-service.provisioning.config.ics_client.clientSecret" -}}
{{- if .Values.provisioning.config.ics_client.credentialSecret.name -}}
valueFrom:
  secretKeyRef:
    name: {{ .Values.provisioning.config.ics_client.credentialSecret.name | quote }}
    key: {{ .Values.provisioning.config.ics_client.credentialSecret.key | quote }}
{{- else if .Values.global.nubusDeployment -}}
valueFrom:
  secretKeyRef:
    name: {{ include "intercom-service.provisioning.config.ics_client.credentialSecret.name" . | quote }}
    key: {{ include "intercom-service.provisioning.config.ics_client.credentialSecret.key" . | quote }}
{{- else -}}
value: {{ required ".Values.provisioning.config.ics_client.clientSecret is required." .Values.provisioning.config.ics_client.clientSecret | quote }}
{{- end -}}
{{- end -}}

{{- define "intercom-service.provisioning.config.nubusBaseUrl" -}}
{{- if .Values.provisioning.config.nubusBaseUrl -}}
{{ .Values.provisioning.config.nubusBaseUrl -}}
{{- else -}}
{{ required ".Values.provisioning.config.nubusBaseUrl is required" .Values.provisioning.config.nubusBaseUrl -}}
{{- end -}}
{{- end -}}