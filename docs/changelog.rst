.. SPDX-FileCopyrightText: 2022-2023 Univention GmbH
..
.. SPDX-License-Identifier: AGPL-3.0-only

.. _app-changelog:

*********
Changelog
*********

This changelog documents all notable changes to the |ICS| app. `Keep a
Changelog <https://keepachangelog.com/en/1.0.0/>`_ is the format and this
project adheres to `Semantic Versioning <https://semver.org/spec/v2.0.0.html>`_.

1.6
===

Released: 11. April 2024


Added
-----

* Reconnect to *Redis* after the service was down.
* *UCR* variables to allow users to configure an external *Redis* server.

Changed
-------

* Image is now based on *UCS* base image.

Fixed
-----

* AppCenter settings are now correctly applied during after installation.

1.5
===

Released: 20. June 2023


Added
-----

* *UCR* variables to set the path to external self-signed certificates.

Security
--------

* Updated dependencies.

1.4
===

Released: 13. December 2022

Changed
-------

* Refresh *Nextcloud* token when expired before proxying the request.
* Improved logging messages with JSON formatting.

Added
-----

* *UCR* variable to set the log level.
* Logging to files and standard output.

Security
--------

* Intercom service requests *Nextcloud* tokens with the *Nextcloud* audience,
  instead of the audience of *OX App Suite*.

1.3
===

Released: 28. October 2022

Changed
-------

* Treat expired refresh tokens as no token, triggering a silent login attempt.
* Matrix login type set to `m.login.application_service` and is not configurable any more.
* Switch to `v3` Matrix client API.

1.2
===

Released: 29. September 2022

Added
-----

* Various debug logs

Changed
-------

* Apply firewall rules during installation to make |ICS| accessible from outside of |UCS|.
* Set Docker DNS based on the *UCR* variables `nameserver1`, `nameserver2` and `nameserver3`.

Security
--------

* The *Filepicker* functionality of |ICS| now fetches a separate token for authenticating with
  the file hosting application *Nextcloud*. The *OX* OIDC-client in the IdP must be allowed, to
  fetch a token for the *Nextcloud* OIDC-client. This was always intended, but not correctly
  enforced in earlier versions.

Fixed
-----

* Update deprecated usage of `express.urlencoded`.
* |ICS| health check failed because of *Nordeck* URL returning `404`.
* Video conferences created as the wrong user.
* Central navigation returning `navigation.json` for the wrong user under certain circumstances.

1.1
===

Released: 16. September 2022

Added
-----

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

Changed
-------

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

Fixed
-----

* Convert the uppercase value for the environment variable :envvar:`PROXY` to
  lowercase. Using the variable in JavaScript requires the value in a lowercase
  string.

1.0
===

Released: 22. August 2022

Added
-----

* Endpoint for OIDC silent login against :program:`Keycloak` on ``/silent``.

* Endpoint to securely proxy requests from *Open-Xchange* to *Nordeck* on ``/nob``,
  allowing the creation of Element videoconferences from *Open-Xchange*.

* Endpoint to securely proxy requests from *Open-Xchange* to *Nextcloud* on ``/fs``,
  allowing to use the email *Filepicker* with *Nextcloud*.

* Endpoint to securely proxy requests from *Open-Xchange* to *UCS Portal* ``/navigation.json``,
  allowing for use of *UCS Portal* central navigation from *Open-Xchange*.

* Session storage with *Redis*.
