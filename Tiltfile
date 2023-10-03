# -*- mode: Python -*-

config.define_string(
    "helmchart-path",
    args=False,
    usage="Path to ICS Helm chart"
)
config.define_string(
    "univention-project-username",
    args=False,
    usage="Username for Univention project at gitlab.souvap-univention.de"
)
config.define_string(
    "gitlab-access-token",
    args=False,
    usage="Access token from gitlab.souvap-univention.de with read_registry scope"
)
cfg = config.parse()

helmchart_path = cfg.get("helmchart-path")
if not helmchart_path:
    print("Please specify a path to the ICS Helm chart")
    exit("No path specified")

univention_project_username = cfg.get("univention-project-username")
if not univention_project_username:
    print("Please specify a username for the Univention project at gitlab.souvap-univention.de")
    exit("No username specified")

gitlab_access_token = cfg.get("gitlab-access-token")
if not gitlab_access_token:
    print("Please specify an access token from gitlab.souvap-univention.de with read_registry scope")
    exit("No access token specified")

# Defaults to `gaia` cluster
allow_k8s_contexts('kubernetes-admin@cluster.local')

namespace = k8s_namespace()
if namespace == 'default':
    print("Please specify a namespace in the Kubeconfig")
    exit("No namespace specified")

docker_build(
    'registry.souvap-univention.de/souvap/tooling/images/intercom-service:development',
    'intercom',
    dockerfile='intercom/Dockerfile',
)

local("""
    kubectl get secret -n {namespace} | grep souvap-gitlab || \
    kubectl create secret docker-registry souvap-gitlab --docker-server=registry.souvap-univention.de --docker-username={univention_project_username} --docker-password={gitlab_access_token} -n {namespace}
    """.format(
    univention_project_username=univention_project_username,
    gitlab_access_token=gitlab_access_token,
    namespace=namespace
))

# Helm charts are provided by DevOps, therefore they are not in this repository.
# Recommended setup is to clone in parallel folder to this repository.

local("helm get values intercom-service -n {namespace} > ics-values.yaml".format(namespace=namespace))

k8s_yaml(
    helm(
        helmchart_path,
        name='intercom-service',
        namespace=namespace,
        # Can be pulled from the cluster with:
        # `helm get values intercom-service -n your-namespace > values.yaml`
        values='ics-values.yaml',
        set=[
            'global.imagePullSecrets[0]=souvap-gitlab',
            'image.imagePullPolicy=Always',
            'image.registry=registry.souvap-univention.de',
            'image.repository=souvap/tooling/images/intercom-service',
            'image.tag=development',
        ]
    )
)
