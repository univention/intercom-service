# intercom-service

![Version: 2.1.0](https://img.shields.io/badge/Version-2.1.0-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square) ![AppVersion: 1.4](https://img.shields.io/badge/AppVersion-1.4-informational?style=flat-square)

intercom service, short ICS, is used to allow inter component API usage from the user's webbrowser

## Maintainers

| Name | Email | Url |
| ---- | ------ | --- |
| Univention |  | <https://www.univention.de/> |

## Requirements

| Repository | Name | Version |
|------------|------|---------|
| https://charts.bitnami.com/bitnami | common | ^2.2.2 |

## Values

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| additionalAnnotations | object | `{}` | Additional custom annotations to add to all deployed objects. |
| additionalLabels | object | `{}` | Additional custom labels to add to all deployed objects. |
| affinity | object | `{}` | Affinity for pod assignment. Ref: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#affinity-and-anti-affinity Note: podAffinityPreset, podAntiAffinityPreset, and nodeAffinityPreset will be ignored when it's set. |
| containerSecurityContext.allowPrivilegeEscalation | bool | `false` | Enable container privileged escalation. |
| containerSecurityContext.capabilities | object | `{"drop":["ALL"]}` | Security capabilities for container. |
| containerSecurityContext.enabled | bool | `true` | Enable security context. |
| containerSecurityContext.privileged | bool | `false` |  |
| containerSecurityContext.readOnlyRootFilesystem | bool | `true` | Mounts the container's root filesystem as read-only. |
| containerSecurityContext.runAsGroup | int | `1000` | Process group id. |
| containerSecurityContext.runAsNonRoot | bool | `true` | Run container as a user. |
| containerSecurityContext.runAsUser | int | `1000` | Process user id. |
| containerSecurityContext.seccompProfile.type | string | `"RuntimeDefault"` | Disallow custom Seccomp profile by setting it to RuntimeDefault. |
| extraEnvVars | list | `[]` | Array with extra environment variables to add to containers.  extraEnvVars:   - name: FOO     value: "bar"  |
| extraVolumeMounts | list | `[]` | Optionally specify an extra list of additional volumeMounts. |
| extraVolumes | list | `[]` | Optionally specify an extra list of additional volumes. |
| fullnameOverride | string | `""` | Provide a name to substitute for the full names of resources. |
| global.domain | string | `""` |  |
| global.imagePullSecrets | list | `[]` | Credentials to fetch images from private registry. Ref: https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/  imagePullSecrets:   - "docker-registry"  |
| global.imageRegistry | string | `"artifacts.software-univention.de"` | Container registry address. |
| global.subDomains.keycloak | string | `""` |  |
| global.subDomains.portal | string | `"portal"` |  |
| ics.default.domain | string | `"example.com"` | Domain which will be added for all subdomains for apps. |
| ics.default.protocol | string | `"https"` | Protocol which will be used to connect to apps. |
| ics.issuerBaseUrl | string | `""` | Base URL of issuer. |
| ics.keycloak.enabled | bool | `true` |  |
| ics.keycloak.realm | string | `"souvap"` | Configured Realm for authentication. |
| ics.keycloak.subdomain | string | `"id"` | Subdomain with "ics.default.protocol" and "ics.default.domain". Mutual exclusive with "url". |
| ics.keycloak.url | string | `""` | URL as FQDN. Mutual exclusive with "subdomain". |
| ics.logLevel | string | `"DEBUG"` | Log level. |
| ics.matrix.asSecret | string | `""` | AS application secret. |
| ics.matrix.enabled | bool | `true` | Enable Matrix. |
| ics.matrix.serverName | string | `"matrix"` | Name of matrix server. |
| ics.matrix.subdomain | string | `"matrix"` | Subdomain with "ics.default.protocol" and "ics.default.domain". Mutual exclusive with "url". |
| ics.matrix.url | string | `""` | URL as FQDN. Mutual exclusive with "subdomain". |
| ics.nextcloud.audience | string | `"ncoidc"` | Audience. |
| ics.nextcloud.enabled | bool | `true` | Enable Nextcloud integration. |
| ics.nextcloud.origin | string | `"fs"` | Origin of nextcloud with "ics.default.protocol" and "ics.default.domain". Mutual exclusive with "originUrl". |
| ics.nextcloud.originUrl | string | `""` | Origin of Nextcloud as FQDN. Mutual exclusive with "origin". |
| ics.nextcloud.subdomain | string | `"fs"` | Subdomain of Nextcloud with "ics.default.protocol" and "ics.default.domain". Mutual exclusive with "url". |
| ics.nextcloud.url | string | `""` | URL of Nextcloud as FQDN. Mutual exclusive with "subdomain". |
| ics.nordeck.enabled | bool | `true` | Enable Nordeck's meeting widget bot. |
| ics.nordeck.mode | string | `"test"` | Widget mode. |
| ics.nordeck.subdomain | string | `"meetings-widget-bot"` | Subdomain with "ics.default.protocol" and "ics.default.domain". Mutual exclusive with "url". |
| ics.nordeck.url | string | `""` | URL as FQDN. Mutual exclusive with "subdomain". |
| ics.oidc.id | string | `"intercom"` | OIDC ClientID. |
| ics.oidc.secret | string | `""` | OIDC Client Secret |
| ics.openxchange.audience | string | `"as8oidc"` | Audience. |
| ics.openxchange.enabled | bool | `true` | Enable Open-Xchange integration. |
| ics.openxchange.subdomain | string | `"webmail"` | Subdomain of Open-Xchange with "ics.default.protocol" and "ics.default.domain". Mutual exclusive with "url". |
| ics.openxchange.url | string | `""` | URL of Open-Xchange as FQDN. Mutual exclusive with "subdomain". |
| ics.originRegex | string | `""` | Origin Regex settings. |
| ics.portal.apiKey | string | `""` | API Key. |
| ics.portal.enabled | bool | `true` | Enable Univention Portal integration. |
| ics.portal.subdomain | string | `"portal"` | Subdomain with "ics.default.protocol" and "ics.default.domain". Mutual exclusive with "url". |
| ics.portal.url | string | `""` | Origin of Univention Portal as FQDN. Mutual exclusive with "subdomain". |
| ics.proxy | bool | `false` | Proxy settings. |
| ics.redis.host | string | `"redis-headless"` | Redis cache service host. |
| ics.redis.password | string | `""` | Redis cache service password. |
| ics.redis.port | string | `"6379"` | Redis cache service port. |
| ics.secret | string | `""` | Intercom service secret shared other services |
| ics.userUniqueMapper | string | `"entryuuid"` | Mapper claim name for the Intercom Service client. The field must be unique along users. If not set, the default value is "entryuuid", which is provisioned by the Intercom Service initContainer. Any other value that "entryuuid" is not guaranteed to be unique on Nubus. |
| image.imagePullPolicy | string | `"IfNotPresent"` | Define an ImagePullPolicy.  Ref.: https://kubernetes.io/docs/concepts/containers/images/#image-pull-policy  "IfNotPresent" => The image is pulled only if it is not already present locally. "Always" => Every time the kubelet launches a container, the kubelet queries the container image registry to             resolve the name to an image digest. If the kubelet has a container image with that exact digest cached             locally, the kubelet uses its cached image; otherwise, the kubelet pulls the image with the resolved             digest, and uses that image to launch the container. "Never" => The kubelet does not try fetching the image. If the image is somehow already present locally, the            kubelet attempts to start the container; otherwise, startup fails.  |
| image.registry | string | `""` | Container registry address. This setting has higher precedence than global.registry. |
| image.repository | string | `"nubus-dev/images/intercom-service"` | Container repository string. |
| image.tag | string | `"latest"` | Define image tag. |
| imagePullSecrets | list | `[]` | Credentials to fetch images from private registry. Ref: https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/  imagePullSecrets:   - "docker-registry"  |
| ingress.annotations | object | `{}` | Define custom ingress annotations. annotations:   nginx.ingress.kubernetes.io/rewrite-target: / |
| ingress.enabled | bool | `true` | Enable creation of Ingress. |
| ingress.host | string | `"ics.example.com"` | Define the Fully Qualified Domain Name (FQDN) where application should be reachable. |
| ingress.ingressClassName | string | `"nginx"` | The Ingress controller class name. |
| ingress.path | string | `"/"` | Define the Ingress path. |
| ingress.pathType | string | `"Prefix"` | Each path in an Ingress is required to have a corresponding path type. Paths that do not include an explicit pathType will fail validation. There are three supported path types:  "ImplementationSpecific" => With this path type, matching is up to the IngressClass. Implementations can treat this                             as a separate pathType or treat it identically to Prefix or Exact path types. "Exact" => Matches the URL path exactly and with case sensitivity. "Prefix" => Matches based on a URL path prefix split by /.  Ref.: https://kubernetes.io/docs/concepts/services-networking/ingress/#path-types |
| ingress.tls | object | `{"enabled":true,"secretName":""}` | Secure an Ingress by specifying a Secret that contains a TLS private key and certificate.  Ref.: https://kubernetes.io/docs/concepts/services-networking/ingress/#tls |
| ingress.tls.enabled | bool | `true` | Enable TLS/SSL/HTTPS for Ingress. |
| ingress.tls.secretName | string | `""` | The name of the kubernetes secret which contains a TLS private key and certificate. Hint: This secret is not created by this chart and must be provided. |
| lifecycleHooks | object | `{}` | Lifecycle to automate configuration before or after startup. |
| livenessProbe.enabled | bool | `true` | Enables kubernetes LivenessProbe. |
| livenessProbe.failureThreshold | int | `3` | Number of failed executions until container is terminated. |
| livenessProbe.initialDelaySeconds | int | `15` | Delay after container start until LivenessProbe is executed. |
| livenessProbe.periodSeconds | int | `5` | Time between probe executions. |
| livenessProbe.successThreshold | int | `1` | Number of successful executions after failed ones until container is marked healthy. |
| livenessProbe.timeoutSeconds | int | `2` | Timeout for command return. |
| nameOverride | string | `""` | String to partially override release name. |
| nodeSelector | object | `{}` | Node labels for pod assignment. Ref: https://kubernetes.io/docs/user-guide/node-selection/ |
| podAnnotations | object | `{}` | Pod Annotations. Ref: https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/ |
| podLabels | object | `{}` | Pod Labels. Ref: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/ |
| podSecurityContext.enabled | bool | `true` | Enable security context. |
| podSecurityContext.fsGroup | int | `1000` | If specified, all processes of the container are also part of the supplementary group. |
| podSecurityContext.fsGroupChangePolicy | string | `"Always"` | Change ownership and permission of the volume before being exposed inside a Pod. |
| provisioning | object | `{"config":{"debug":{"enabled":false,"pauseBeforeScriptStart":0},"ics_client":{"clientSecret":"","credentialSecret":{"key":""}},"keycloak":{"connection":{"host":"","port":""},"credentialSecret":{"key":"password","name":""},"password":"","realm":"","username":""},"nubusBaseUrl":""},"extraEnvVars":[],"extraVolumeMounts":[],"image":{"imagePullSecrets":[],"registry":"artifacts.software-univention.de","repository":"nubus/images/wait-for-dependency","tag":"0.26.0"},"provisioningImage":{"imagePullPolicy":"IfNotPresent","imagePullSecrets":[],"registry":"artifacts.software-univention.de","repository":"nubus/images/keycloak-bootstrap","tag":"0.1.2"},"securityContext":{"allowPrivilegeEscalation":false,"capabilities":{"drop":["ALL"]},"enabled":true,"privileged":false,"readOnlyRootFilesystem":true,"runAsGroup":1000,"runAsNonRoot":true,"runAsUser":1000,"seccompProfile":{"type":"RuntimeDefault"}}}` | The Intercom Service Keycloak provisioning job |
| provisioning.config.debug.enabled | bool | `false` | Enable debug output of included Ansible scripts |
| provisioning.config.debug.pauseBeforeScriptStart | int | `0` | Seconds for the job to pause before starting the actual bootstrapping. |
| provisioning.config.ics_client.clientSecret | string | `""` | Specify this only if you do not want to use a secret (see below). |
| provisioning.config.keycloak | object | `{"connection":{"host":"","port":""},"credentialSecret":{"key":"password","name":""},"password":"","realm":"","username":""}` | Keycloak specific settings. |
| provisioning.config.keycloak.connection | object | `{"host":"","port":""}` | Connection parameters. |
| provisioning.config.keycloak.connection.host | string | `""` | Keycloak host. |
| provisioning.config.keycloak.connection.port | string | `""` | Keycloak port. |
| provisioning.config.keycloak.credentialSecret | object | `{"key":"password","name":""}` | Keycloak password secret reference. |
| provisioning.config.keycloak.password | string | `""` | Keycloak password. |
| provisioning.config.keycloak.realm | string | `""` | Keycloak realm. |
| provisioning.config.keycloak.username | string | `""` | Keycloak user. |
| provisioning.config.nubusBaseUrl | string | `""` | Base URL for setting in Keycloak application URL without backslash. Example: "https://ics.uv-jtorres-dev.gaia.open-desk.cloud" |
| provisioning.extraEnvVars | list | `[]` | Array with extra environment variables to add to containers.  extraEnvVars:   - name: FOO     value: "bar" |
| provisioning.extraVolumeMounts | list | `[]` | Optionally specify an extra list of additional volumeMounts. |
| provisioning.securityContext.allowPrivilegeEscalation | bool | `false` | Enable container privileged escalation. |
| provisioning.securityContext.capabilities | object | `{"drop":["ALL"]}` | Security capabilities for container. |
| provisioning.securityContext.enabled | bool | `true` | Enable security context. |
| provisioning.securityContext.readOnlyRootFilesystem | bool | `true` | Mounts the container's root filesystem as read-only. |
| provisioning.securityContext.runAsGroup | int | `1000` | Process group id. |
| provisioning.securityContext.runAsNonRoot | bool | `true` | Run container as a user. |
| provisioning.securityContext.runAsUser | int | `1000` | Process user id. |
| provisioning.securityContext.seccompProfile.type | string | `"RuntimeDefault"` | Disallow custom Seccomp profile by setting it to RuntimeDefault. |
| readinessProbe.enabled | bool | `true` | Enables kubernetes ReadinessProbe. |
| readinessProbe.failureThreshold | int | `15` | Number of failed executions until container is terminated. |
| readinessProbe.initialDelaySeconds | int | `5` | Delay after container start until ReadinessProbe is executed. |
| readinessProbe.periodSeconds | int | `2` | Time between probe executions. |
| readinessProbe.successThreshold | int | `1` | Number of successful executions after failed ones until container is marked healthy. |
| readinessProbe.timeoutSeconds | int | `1` | Timeout for command return. |
| replicaCount | int | `1` | Set the amount of replicas of deployment. |
| resources.limits.cpu | string | `"500m"` | The max number of CPUs to consume. |
| resources.limits.memory | string | `"128Mi"` | The max number of RAM to consume. |
| resources.requests.cpu | string | `"10m"` | The number of CPUs which has to be available on the scheduled node. |
| resources.requests.memory | string | `"32Mi"` | The number of RAM which has to be available on the scheduled node. |
| service.annotations | object | `{}` | Additional custom annotations. |
| service.enabled | bool | `true` | Enable kubernetes service creation. |
| service.ports.http.containerPort | int | `8008` | Internal port. |
| service.ports.http.port | int | `8008` | Accessible port. |
| service.ports.http.protocol | string | `"TCP"` | service protocol. |
| service.sessionAffinity | object | `{"enabled":false,"timeoutSeconds":10800}` | Configure session affinity for to hit the same backend for the period specified in `timeoutSeconds`.  Ref.: https://kubernetes.io/docs/reference/networking/virtual-ips/#session-affinity |
| service.sessionAffinity.enabled | bool | `false` | Whether to enable session affinity or not. |
| service.sessionAffinity.timeoutSeconds | int | `10800` | The session duration in seconds. |
| service.type | string | `"ClusterIP"` | Choose the kind of Service, one of "ClusterIP", "NodePort" or "LoadBalancer". |
| serviceAccount.annotations | object | `{}` | Additional custom annotations for the ServiceAccount. |
| serviceAccount.automountServiceAccountToken | bool | `false` | Allows auto mount of ServiceAccountToken on the serviceAccount created. Can be set to false if pods using this serviceAccount do not need to use K8s API. |
| serviceAccount.create | bool | `true` | Enable creation of ServiceAccount for pod. |
| serviceAccount.labels | object | `{}` | Additional custom labels for the ServiceAccount. |
| terminationGracePeriodSeconds | string | `""` | In seconds, time the given to the pod needs to terminate gracefully. Ref: https://kubernetes.io/docs/concepts/workloads/pods/pod/#termination-of-pods |
| tolerations | list | `[]` | Tolerations for pod assignment. Ref: https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/ |
| topologySpreadConstraints | list | `[]` | Topology spread constraints rely on node labels to identify the topology domain(s) that each Node is in. Ref: https://kubernetes.io/docs/concepts/workloads/pods/pod-topology-spread-constraints/  topologySpreadConstraints:   - maxSkew: 1     topologyKey: failure-domain.beta.kubernetes.io/zone     whenUnsatisfiable: DoNotSchedule |
| updateStrategy.type | string | `"RollingUpdate"` | Set to Recreate if you use persistent volume that cannot be mounted by more than one pods to make sure the pods are destroyed first. |

