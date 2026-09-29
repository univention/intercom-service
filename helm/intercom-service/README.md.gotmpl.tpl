<!--
SPDX-FileCopyrightText: 2023-2025 Univention GmbH
SPDX-License-Identifier: AGPL-3.0-only
-->
{{ template "chart.header" . }}
{{ template "chart.description" . }}

## Installing the Chart

To install the chart with the release name `my-release`, you have two options:

### Install via Repository
```console
helm repo add ${CI_PROJECT_NAME} ${CI_SERVER_PROTOCOL}://${CI_SERVER_HOST}/api/v4/projects/${CI_PROJECT_ID}/packages/helm/stable
helm install my-release --version ${RELEASE_VERSION} ${CI_PROJECT_NAME}/{{ template "chart.name" . }}
```

### Install via OCI Registry
```console
helm repo add ${CI_PROJECT_NAME} oci://${CI_REGISTRY_IMAGE}
helm install my-release --version ${RELEASE_VERSION} ${CI_PROJECT_NAME}/{{ template "chart.name" . }}
```

## Trusting a private certificate authority

The Intercom Service verifies the TLS certificates of Keycloak, Matrix, the Nordeck bot, Nextcloud, XWiki and the
portal. If these services use certificates of a private certificate authority, provide the CA certificate in
[PEM format](https://nodejs.org/api/cli.html#node_extra_ca_certsfile) through `NODE_EXTRA_CA_CERTS`, for example
from a ConfigMap `private-ca` with the key `ca.crt`:

```yaml
extraEnvVars:
  - name: "NODE_EXTRA_CA_CERTS"
    value: "/etc/ssl/private-ca/ca.crt"
extraVolumes:
  - name: "private-ca"
    configMap:
      name: "private-ca"
extraVolumeMounts:
  - name: "private-ca"
    mountPath: "/etc/ssl/private-ca"
    readOnly: true
```

`NODE_EXTRA_CA_CERTS` is read once at startup and applies to all connections. If `ics.redis.ssl.customca` is set,
the chart already sets `NODE_EXTRA_CA_CERTS` to `ics.redis.ssl.pathCA`. Then either put all CA certificates into
that file, or set `NODE_EXTRA_CA_CERTS` in `extraEnvVars` as shown above to a bundle that also contains the Redis CA:
the value from `extraEnvVars` takes precedence.

{{ template "chart.requirementsSection" . }}

{{ template "chart.valuesSection" . }}

## Uninstalling the Chart

To install the release with name `my-release`:

```bash
helm uninstall my-release
```

## Signing

### Chart

Helm charts are signed with helm native signing method. You can verify the charts against this GPG key:

```
${GPG_SOUVAP_UNIVENTION_PUB}
```

### Images

Container images are signed via [cosign](https://github.com/sigstore/cosign) and can be verified with:

```
${COSIGN_PUBLIC_KEY}
```

```
cosign verify --key cosign.pub --insecure-ignore-tlog <image>
```

## License
This project uses the following license: AGPL-3.0-only


## Copyright
Copyright (C) 2023-2025 Univention GmbH
