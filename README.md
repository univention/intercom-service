# intercom-service (ICS)

ICS is an intermediary for communication between applications like Nextcloud,
OX App Suite and Matrix. The functionalities File-picker, Video conference,
create and accessing the Univention-Portal navigation endpoint from other apps
require the app UCS Intercom Service.
You can think of it as an authentication reverse-proxy.

## Documentation

Public documentation can be found [here](https://docs.software-univention.de/intercom-service/latest/).

## Development

This repository provides a `Tiltfile` for easier development. If you are new to
tilt, please [check their documentation](https://tilt.dev/)

Here are some steps to get you up and running:
1. Having tilt installed in your machine.
2. Setup `gaia` cluster. Steps for doing so are [here](https://gitlab.souvap-univention.de/groups/souvap/devops/-/wikis/K8s-cluster-legacy).
    > Note that you need to add your namespace to the Kubeconfig that is provided above.
3. Run a pipeline in `souvereign-workplace` with the variables specified [here](https://gitlab.souvap-univention.de/souvap/devops/sovereign-workplace/-/pipelines/new?ref=main&var[NAMESPACE]=uv-username&var[CLUSTER]=gaia&var[BASE_DOMAIN]=open-desk.cloud&var[DEPLOY_KEYCLOAK]=yes&var[DEPLOY_UCS]=yes&var[DEPLOY_ELEMENT]=yes&var[DEPLOY_NEXTCLOUD]=yes&var[DEPLOY_ICS]=yes&var[DEPLOY_OX]=yes&var[ENV_STOP_BEFORE]=yes&var[RUN_TESTS]=no). Note you need to create a branch to run a pipeline.
4. `cp tilt_config.json.example tilt_config.json` and fill your values with:
    1. The path to the cloned [ICS helmcharts](https://gitlab.souvap-univention.de/souvap/tooling/charts/intercom-service)
    2. Your username for [SouvAP GitLab](https://gitlab.souvap-univention.de)
    3. An access token with `read_registry` scope geenrated from [here](https://gitlab.souvap-univention.de/-/profile/personal_access_tokens).
5. Run `tilt up`.
