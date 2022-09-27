# Quality Assurance

A document to recap all the steps needed to ensure a proper QA and pre-release steps throughout ICS.
Feel free to add steps if needed, ensuring a better QA as a result.


### Test use cases

It is important to test that functionality is still there. Thus, please start your release review with the following aspects.
> While running these use cases, it would be nice to open the container logs with `docker logs -f intercom-service` and check nothing weird happens.

> :warning: **Known problem**: Log into Element once via the browser, this causes the current user to be created and is a prerequisite for the create of any videoconference :warning:


##### Videoconference

1. Log into OX.
2. Go to the calendar.
3. Schedule a meeting which includes a videoconference room.


##### Filepicker
1. Go to Nextcloud and create a file
2. Log into OX.
3. Go to the email and compose an email.
4. Try to attach a file from Nextcloud with the bottom filepicker.


##### Central Navigation
1. Log into OX and click the top left corner menu button. Central Navigation should be available.
2. Log into Nextcloud and click the top left corner menu button. Central Navigation should be available.


##### Refresh token
1. Go to the Keycloak admin interface. Select the realm containing OX, Nextcloud, ICS and Element. Go to `Realm Settings`, select the tab `Tokens` and set the `SSO Session Idle` to 5 minutes. Undo these settings at the end of this QA-step.
2. Leave a session open for more than 5 minutes
3. Then try to use any of the first two use cases.


##### Backchannel-logout
1. Make sure to have triggered the silent login into ICS, for example by opening OX.
2. Track the docker logs with `docker logs -f intercom-service`.
3. Go to the Keycloak-admin interface, navigate to `Users`, search for the user you are logged in as in ICS, click the user, go to the `Sessions` tab and manually log out the session.



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
