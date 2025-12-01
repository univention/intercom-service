.. SPDX-FileCopyrightText: 2022-2025 Univention GmbH
..
.. SPDX-License-Identifier: AGPL-3.0-only

.. _app-changelog:

*********
Changelog
*********

This changelog documents all notable changes to the |ICS| app. `Keep a
Changelog <https://keepachangelog.com/en/1.0.0/>`_ is the format and this
project adheres to `Semantic Versioning <https://semver.org/spec/v2.0.0.html>`_.

v1.10
=====

Released: 9. December 2025

Add
---

* *UCR* variables to allow configuration of session cookies.

  * :envvar:`intercom-service/settings/enable-session-cookie`
    to enable session cookie (transient cookie).

  * :envvar:`intercom-service/settings/session-rolling-duration` in seconds.
    The duration for which the session will be reset
    if the user is active within this time.

Security
--------

* Critical CVE :uv:cve:`2025-49844` in :program:`redis-server`.


v1.9
====

Released: 28. January 2025

Add
---

* Access Tokens are now attempted to be fetched from an integration if the integration
  is enabled but a current session does not have a token for the service. This allows
  for *XWiki* and *Matrix* integrations to become healthy in a user session once
  a user has used those services once, thus the account exists in the respective service.

* The *Redis* connection now supports TLS. Also, mTLS authentication can be configured.

* *UCR* variables to configure SSL connection to *Redis*.

  * :envvar:`intercom-service/redis/ssl` to activate or deactivate the SSL connection to the *Redis* server.

  * :envvar:`intercom-service/redis/mtls` to activate or deactivate the mTLS authentication to the *Redis* server.

  * :envvar:`intercom-service/redis/certificates/mtls/cert` to specify the path to certificate used during mTLS.

  * :envvar:`intercom-service/redis/certificates/mtls/key` to specify the path to certificate secret key used during mTLS.

Change
------

* Better log formatting in JSON for proxied routes.

Fix
---

* Missing imports in the *XWiki* proxy caused the service to crash under certain circumstances.

* Wrong logger configuration caused some log messages to not be correctly formatted.


v1.8
====

Released: 15. December 2024

Add
---

* Endpoint to securely proxy requests from *Univention-Portal* to *XWiki* on ``/wiki``,
  allowing to load *RSS* feeds from *XWiki*.

* *UCR* variables to configure *XWiki*.

  * :envvar:`intercom-service/xwiki/enabled` to activate or deactivate *XWiki* integration.

  * :envvar:`intercom-service/xwiki/url` to set the URL of the *XWiki* instance.

  * :envvar:`intercom-service/xwiki/audience` to configure the |OIDC| client.

* *UCR* variable :envvar:`intercom-service/settings/username-claim` to configure
  the claim in the identity token that contains the username.

* *UCR* variable :envvar:`intercom-service/nextcloud/enabled` and
  :envvar:`intercom-service/matrix/enabled` to activate or deactivate the
  respective services.


Change
------

* Load all the configuration during initialization to improve asynchronous performance.

* Updated base image to *UCS 5.2-0* December 2024 build.

Fix
---

* *Univention-Portal* navigation crashed the application if the :envvar:`intercom-service/settings/username-claim` Keycloak mapping
  was missing in the access token.

v1.7
====

Released: 15. November 2024


Add
---

* *UCR* variable :envvar:`intercom-service/settings/user-unique-mapper` to configure the unique user claim name for the *Keycloak* OIDC client.

Change
------

* Order of middlewares for *Nextcloud* proxying caused authentication prompts in some cases.

v1.6
====

Released: 22. April 2024

Add
---

* Reconnect to *Redis* after the service was down.

* *UCR* variables to allow users to configure an external *Redis* server.

  * :envvar:`intercom-service/redis/host` to set the hostname of the *Redis* server.

  * :envvar:`intercom-service/redis/port` to set the port of the *Redis* server.

  * :envvar:`intercom-service/redis/user` to set the password of the *Redis* server.

Change
------

* Image is now based on *UCS* base image.

Fix
---

* AppCenter settings are now correctly applied during after installation.

v1.5
====

Released: 20. June 2023

Add
---

* *UCR* variables to set the path to external self-signed certificates.

Security
--------

* Updated dependencies.

v1.4
====

Released: 13. December 2022

Change
------

* Refresh *Nextcloud* token when expired before proxying the request.
* Improved logging messages with JSON formatting.

Add
---

* *UCR* variable to set the log level.
* Logging to files and standard output.

Security
--------

* Intercom service requests *Nextcloud* tokens with the *Nextcloud* audience,
  instead of the audience of *OX App Suite*.

v1.3
====

Released: 28. October 2022

Change
------

* Treat expired refresh tokens as no token, triggering a silent login attempt.
* Matrix login type set to `m.login.application_service` and is not configurable any more.
* Switch to `v3` Matrix client API.

v1.2
====

Released: 29. September 2022

Add
---

* Various debug logs

Change
------

* Apply firewall rules during installation to make |ICS| accessible from outside of |UCS|.
* Set Docker DNS based on the *UCR* variables `nameserver1`, `nameserver2` and `nameserver3`.

Security
--------

* The *Filepicker* functionality of |ICS| now fetches a separate token for authenticating with
  the file hosting application *Nextcloud*. The *OX* OIDC-client in the IdP must be allowed, to
  fetch a token for the *Nextcloud* OIDC-client. This was always intended, but not correctly
  enforced in earlier versions.

Fix
---

* Update deprecated usage of `express.urlencoded`.
* |ICS| health check failed because of *Nordeck* URL returning `404`.
* Video conferences created as the wrong user.
* Central navigation returning `navigation.json` for the wrong user under certain circumstances.

v1.1
====

Released: 16. September 2022

Add
---

Stability
   * |ICS| split the cookie headers by a logic that didn't consider certain
     cases. Now, |ICS| uses a standard cookie library for the handling cookie
     headers.

   * During app installation, |ICS| tests the URLs of the required services
     :program:`Keycloak`, *Nextcloud*, *Nordeck*, and *UCS Portal*, if it can
     reach them. The installation shows a warning, if the test can't reach the
     services. Additionally, |ICS| runs a health check within the Docker
     container every 60 seconds to test, if it can reach the services.

Refreshing Access Tokens
   A middleware that automatically refreshes access tokens when they expire.

Change
------

* Improve the readability of user documentation.

Security
--------

* The *Redis* database provides persistence for app sessions. The update applies
  the following security fixes to *Redis*:

  * Password protection provided in :file:`/etc/intercom-redis.secret`.

  * The Redis container is only accessible from the :command:`docker-compose`
    internal network (``external: false``).

* Verify the JWT (JSON Web Token) access or ID token with the public key of the
  *Keycloak* issuer.

* Enable ``backchannel-logout`` and remove the appropriated app-session from
  |ICS|.

Fix
---

* Convert the uppercase value for the environment variable :envvar:`PROXY` to
  lowercase. Using the variable in JavaScript requires the value in a lowercase
  string.

v1.0
====

Released: 22. August 2022

Add
---

* Endpoint for OIDC silent login against :program:`Keycloak` on ``/silent``.

* Endpoint to securely proxy requests from *Open-Xchange* to *Nordeck* on ``/nob``,
  allowing the creation of Element videoconferences from *Open-Xchange*.

* Endpoint to securely proxy requests from *Open-Xchange* to *Nextcloud* on ``/fs``,
  allowing to use the email *Filepicker* with *Nextcloud*.

* Endpoint to securely proxy requests from *Open-Xchange* to *UCS Portal* ``/navigation.json``,
  allowing for use of *UCS Portal* central navigation from *Open-Xchange*.

* Session storage with *Redis*.
