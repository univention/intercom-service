# Quality Assurance

A document to recap all the steps needed to ensure a proper QA and pre-release steps throughout ICS.
Feel free to add steps if needed, ensuring a better QA as a result.

## Deploying ICS

1. Before attempting all these steps, an account it OpenCode is needed. Please request one if you don't have it already.
1. Go to https://gitlab.opencode.de/bmi/opendesk/deployment/opendesk/
1. Clone the project
1. Create a branch from `develop` using your `username/branch-name` convention
1. Open the file `helmfile/environments/default/images.yaml.gotmpl`
1. Find `images.intercom` entry.
1. Change the following entries:
   ```yaml
   intercom:
       registry: "artifacts.software-univention.de"
       repository: "nubus-dev/images/intercom-service"
       tag: "see-semantic-release-job-version"
   ```
1. Open the file `helmfile/apps/nubus/values-intercom-service.yaml.gotmpl`
1. Find the entry `image.registry` and set it to `{{ .Values.images.intercom.registry | quote }}`
1. Commit your changes and push the branch.
1. Go to [Pipelines](https://gitlab.opencode.de/bmi/opendesk/deployment/opendesk/-/pipelines/new)
    1. Select the branch you just pushed.
    1. Set `NAMESPACE` to `uv-username`
    1. Set `DEPLOY_SERVICES` to `yes`
    1. Set `DEBUG_ENABLED` to `yes`
    1. Set `DEPLOY_UMS` to `yes`
    1. Set `DEPLOY_OX` to `yes`
    1. Set `DEPLOY_NEXTCLOUD` to `yes`
    1. Set `DEPLOY_ELEMENT` to `yes`
    1. Set `DEPLOY_XWIKI` to `yes`
    1. Run the pipeline and wait for it to finish
    > This will deploy a partial openDesk environment to the [dev cluster](https://gitlab.opencode.de/bmi/opendesk-internal/platform-development/opendesk-env/-/wikis/Cluster-Dev)
    > You can get the `dev` cluster kubeconfig from [here](https://gitlab.opencode.de/bmi/opendesk-internal/platform-development/opendesk-env/-/wikis/Keycloak)
    > You can also set `uv-gaia` as `CLUSTER` variable to deploy to the Gaia cluster.
1. Login as administrator in `portal.uv-username.opendesk.site` with the credentials in https://gitlab.opencode.de/bmi/opendesk-internal/platform-development/opendesk-env#get-your-own-environment
1. Create a test user with email and password.
1. Log in with it.

## Test use cases

It is important to test that functionality is still there. Thus, please start your release review with the following aspects.
> While running these use cases, it would be nice to open the container logs with `docker logs -f intercom-service` and check nothing weird happens.

> :warning: **Known problem**: Log into Element once via the browser, this causes the current user to be created and is a prerequisite for the create of any videoconference :warning:


##### Videoconference

> Please login into Element before trying this use-case for the first time in an environment.

1. Log into OX.
2. Go to the calendar.
3. Schedule a meeting and attempt adding a videoconference room.
4. A Link should be shown in the appointment.


##### Filepicker
1. Go to Nextcloud and create a file.
2. Log into OX.
3. Go to the email and compose an email.
4. Try to attach a file from Nextcloud with the bottom filepicker.


##### Central Navigation
1. Log into OX and click the top left corner menu button. Central Navigation should be available.
2. Log into Nextcloud and click the top left corner menu button. Central Navigation should be available.


##### Newsfeed

> XWiki and the Univention Portal newsfeed toggle are required for this use case.
1. Login into the Univention Portal.
1. Check that there was a successful silent login into ICS (`/silentLogin`).
1. Check that the newsfeed is available and working.


##### Refresh token
1. Go to the Keycloak admin interface. Select the realm containing OX, XWiki, Nextcloud, ICS and Element. Go to `Realm Settings`, select the tab `Sessions` and set the `SSO Session Idle` to 5 minutes. Undo these settings at the end of this QA-step.
2. Leave a session open for more than 5 minutes
3. Then try to use any of the first two use cases.
4. Undo the changes.


##### Backchannel-logout
1. Make sure to have triggered the silent login into ICS, for example by opening OX.
2. Track the docker logs with `docker logs -f intercom-service` or `l` on k9s.
3. Go to the Keycloak-admin interface and login.
4. Select the `opendesk` realm.
5. Navigate to `Sessions`.
6. Search for the user you are logged in as in ICS (and the Portal and others)
7. Manually log out the session by clicking `Sign out` in the three dots menu.

### Upgradeability

`intercom-service` should be upgradeable from previous versions. As bare minimum we should be able to go from the previous released version to the normal one. Please use the following steps:

1. `univention-app remove intercom-service` and make sure there is no intercom-service version installed.
2. `univention-app dev-use-test-appcenter --revert` to make sure we are on the normal AppCenter.
3. `univention-app update` to get the latest version from the normal AppCenter.
4. `univention-app install intercom-service` will install the latest published release.
5. `univention-install univention-appcenter-dev` to install the test AppCenter.
6. `univention-app dev-use-test-appcenter` to start using the test AppCenter.
7. `univention-app update` to get all the versions from the test AppCenter.
8. `univention-app upgrade intercom-service` to upgrade the app to the pre-release version on the AppCenter.

> If you want to install a fixed version other than the last one, use `univention-app install intercom-service=version`.

### Version bump

Before releasing, make sure you change the version number in the following files:

1. `appcenter/ini` and bump `Version`.
2. `update-appcenter-test.sh` to bump `APP_VERSION`.
3. `appcenter/compose` for the docker image you are using, even though it will be taken care of on the release process.
4. `intercom/package.json` to specify the nodejs app `version`.
5. `.gitlab-ci` to bump the variable `DOC_TARGET_VERSION: "X.X"`.

> You do not need to change `docs/conf.py`, since it will be overwritten from a `.gitlab-ci` variable

### Startup checks

All steps above can be successfully tested, but the app might still malfunction in some cases. This entry is for those.

###### Docker health

1. `docker ps` and check than `intercom-service` is healthy.

> If the container is not healthy, please run `docker inspect --format='{{json .State.Health}}' intercom-service`

##### Installation/Upgrade

Please pay attention during both processes. The following questions may help:

1. Are the files created correctly?
    1. `/etc/intercom.secret`
    2. `/etc/intercom-client.secret`
    3. `/etc/intercom-redis.secret` this file should be created but it didn't exist on the initial 1.0 release.
    4. `/etc/intercom-portal.secret`
    5. `/etc/matrix.secret`
2. Are warnings being displayed properly during installation, such as URLs check warnings?

## Release

You will need to request an account at the [Univention Provider Portal](https://provider-portal.software-univention.de/).

### Upgradeability

`intercom-service` should be upgradeable from previous versions. As bare minimum we should be able to go from the previous released version to the current one. Please use the following steps:

1. `univention-app remove intercom-service` and make sure there is no intercom-service version installed.
2. `univention-app dev-use-test-appcenter --revert` to make sure we are on the normal AppCenter.
3. `univention-app update` to get the latest version from the normal AppCenter.
4. `univention-app install intercom-service` will install the latest published release.
5. `univention-install univention-appcenter-dev` to install the test AppCenter.
6. `univention-app dev-use-test-appcenter` to start using the test AppCenter.
7. `univention-app update` to get all the versions from the test AppCenter.
8. `univention-app upgrade intercom-service` to upgrade the app to the pre-release version on the AppCenter.

> If you want to install a fixed version other than the last one, use `univention-app install intercom-service=version`.
