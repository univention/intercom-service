.. SPDX-FileCopyrightText: 2022-2025 Univention GmbH
..
.. SPDX-License-Identifier: AGPL-3.0-only

.. _app-configuration:

*************
Configuration
*************

The app |ICS_p| offers various configuration options. Some settings don't allow
changes after installation. Therefore, you must set them **before**
installation. You find those settings marked with *Only before installation* in
:ref:`app-settings`. You can change all other settings at any time after the
installation.

To change settings after installation, sign in to the UCS management system with
a username with administration rights and go to :menuselection:`App Center -->
UCS Intercom Service --> Manage Installation --> App Settings`. On the appearing
*Configure UCS Intercom Service* page, you can change the settings and apply them to
the app by clicking :guilabel:`Apply Changes`.

The App Center then *re-initializes* the Docker container for the app
|ICS_p|. *Reinitialize* means the App Center throws away the
running |ICS| Docker container and creates a fresh |ICS| Docker container with
the just changed settings.

.. _basic:

Intercom Service
================

The app |ICS_p| provides the backend for inter-app
communication of *Nextcloud*, the *UCS Portal*, *Matrix* through the
*Nordeck* bot, *OX App Suite* and *XWiki*.

.. warning::

   This app doesn't configure any *Keycloak* settings. It requires an existing
   client and realm setup in *Keycloak*.


.. _app-secrets:

Secrets
=======

The app |ICS_p| requires secrets, that aren't automatically
generated. Those secrets are:

:file:`/etc/intercom-client.secret`
   The client secret for authenticating with the :term:`IdP`. You can retrieve
   the client secret from the *Keycloak Admin Console* in the *Authorization* tab
   of the *intercom-client*.

:file:`/etc/matrix.secret`
   The secret for backend communication with the *Matrix* server. You can
   retrieve it from the automatic join app service on the system running
   *Matrix*.

   The following command shows how to retrieve the secret for the backend
   communication with the *Matrix* server:

   .. code-block:: console

      $ kubectl exec --stdin --tty synapse-0 -n matrix-000-prod -- \
          /bin/bash -c "cat /data/autojoin-appservice.yaml \
          | grep as_token \
          | sed -e 's/as_token. \(.\+\)/\1/'"

:file:`/etc/intercom-portal.secret`
   The secret to communicate with the UCS Portal navigation service. You can
   retrieve the secret from :file:`/etc/portal-navigation-service.secret`.

:file:`/etc/intercom-redis.secret`
   The secret to communicate with the app *Redis*, that stores the sessions. It
   is only needed if you use an external *Redis* server. Otherwise, it will be
   generated during installation.

.. _app-settings:

Settings
========

The following references show the available settings within the app
|ICS_p|. Univention recommends to keep the default values.

.. envvar:: intercom-service/settings/client-id

    Defines the |OIDC| client name of |ICS| in *Keycloak*. The file
    :file:`/etc/ics_client.secret` stores the secret of this client.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

        * - Required
          - Default value
          - Set

        * - Yes
          - ``intercom``
          - Only before installation

.. envvar:: intercom-service/settings/user-unique-mapper

    Defines the *Keycloak* |ICS| client token claim name mapper configured. The
    field must uniquely identify the user across *Matrix*, *Nextcloud*,
    *OX App Suite*, and the *Nubus*. Only the value ``entryuuid`` is guaranteed
    to be unique in Nubus.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

        * - Required
          - Default value
          - Set

        * - Yes
          - ``entryuuid``
          - Only before installation

.. envvar:: intercom-service/settings/username-claim

    Defines the *Keycloak* |ICS| client token claim name mapper configured. The
    field must contain the username of the user.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

        * - Required
          - Default value
          - Set

        * - Yes
          - ``phoenixusername``
          - Only before installation

.. envvar:: intercom-service/settings/enable-session-cookie

    Enable session cookie (transient cookie). If enabled, the session cookie
    will be deleted at the end of the browser session. Otherwise, the session
    will be a rolling session (reset every time the user is active).

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

        * - Required
          - Default value
          - Set

        * - No
          - ``true``
          - Only before installation

.. envvar:: intercom-service/settings/session-rolling-duration

    Rolling session duration in seconds. The session will be reset if the user
    is active within the duration. Otherwise, the user will be logged out, 
    requiring a silent login. If :envvar:`intercom-service/settings/enable-session-cookie` is set to true, this
    setting will be ignored.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

        * - Required
          - Default value
          - Set

        * - No
          - ``86400``
          - Only before installation

.. envvar:: intercom-service/settings/intercom-url

   Defines the URL where you can reach |ICS|. This needs to be a externally
   reachable address as it's used by the browser to connect to |ICS|.

   .. list-table::
       :header-rows: 1
       :widths: 2 5 5

       * - Required
         - Default value
         - Set

       * - Yes
         - ``https://ics.@%@domainname@%@``
         - Only before installation


.. envvar:: intercom-service/settings/base-url

   Defines the base URL used to identify with the :term:`IdP`. This URL must
   match the base URL defined in the |OIDC| client used on the :term:`IdP`. The
   value should be the same as in :envvar:`intercom-service/settings/intercom-url`.

   .. list-table::
       :header-rows: 1
       :widths: 2 5 5

       * - Required
         - Default value
         - Set

       * - Yes
         - ``https://ics.@%@domainname@%@``
         - Only before installation

.. envvar:: intercom-service/keycloak/url

   URL of the *Keycloak* instance that |ICS| uses as :term:`IdP`. |ICS| ignores
   this value, if :envvar:`intercom-service/settings/issuer-base-url` is defined.

   .. list-table::
       :header-rows: 1
       :widths: 2 5 5

       * - Required
         - Default value
         - Set

       * - Yes
         - ``https://id.@%@domainname@%@``
         - Only before installation

.. envvar:: intercom-service/keycloak/realm-name

   Name of the realm containing the configured |OIDC| |ICS| client. |ICS| ignore
   this value, if :envvar:`intercom-service/settings/issuer-base-url` is defined.

   .. list-table::
       :header-rows: 1
       :widths: 2 5 5

       * - Required
         - Default value
         - Set

       * - Yes
         - ``UCS``
         - Only before installation

.. envvar:: intercom-service/settings/issuer-base-url

    Defines a full base URL for the |OIDC| token issuer. Usually, the
    :term:`IdP` *Keycloak* issues |OIDC| tokens.

    This variable overwrites :envvar:`intercom-service/keycloak/url` and
    :envvar:`intercom-service/keycloak/realm-name`.

    Only set this variable, if you really need to change the default URL
    generated from the before mentioned variables.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

        * - Required
          - Default value
          - Set

        * - No
          - ``None``
          - Only before installation

.. envvar:: intercom-service/settings/origin-regex

   Defines the origin :term:`CORS` regular expression. Normally this will be the
   shared domain name. Changing this value may have security implications.

   .. list-table::
       :header-rows: 1
       :widths: 2 5 5

       * - Required
         - Default value
         - Set

       * - Yes
         - ``@%@domainname@%@``
         - Only before installation

.. envvar:: intercom-service/settings/log-level

   Logging level for the standard output, as well as, log file at ``intercom-service.log``.

   .. list-table::
       :header-rows: 1
       :widths: 2 5 5

       * - Required
         - Default value
         - Set

       * - Yes
         - ``info``
         - Only before installation

.. envvar:: intercom-service/settings/proxy

    This setting is passed to *node-axios* within the container. It allows or
    disallows connections through a proxy server between |ICS| and apps like
    *Matrix*, *Nextcloud*, or *OX App Suite*, instead of a direct connection to
    the backends.

    .. list-table::
       :header-rows: 1
       :widths: 2 5 5

       * - Required
         - Default value
         - Set

       * - Yes
         - ``False``
         - Before installation or application settings afterwards.

.. envvar:: intercom-service/redis/host

   Defines the host name of the *Redis* server. By default |ICS| uses the
   bundled *Redis* server.

   .. list-table::
       :header-rows: 1
       :widths: 2 5 5

       * - Required
         - Default value
         - Set

       * - Yes
         - ``redis-intercom``
         - Before installation or application settings afterwards.

.. envvar:: intercom-service/redis/port

   Port where the *Redis* server is available.

   .. list-table::
       :header-rows: 1
       :widths: 2 5 5

       * - Required
         - Default value
         - Set

       * - Yes
         - ``6379``
         - Before installation or application settings afterwards.

.. envvar:: intercom-service/redis/user

   The user name for the *Redis* server. By default |ICS| uses the `default` user.

   .. list-table::
       :header-rows: 1
       :widths: 2 5 5

       * - Required
         - Default value
         - Set

       * - Yes
         - ``default``
         - Before installation or application settings afterwards.

.. envvar:: intercom-service/redis/ssl

   Activates the SSL connection to the *Redis* server. Set to ``False`` by default.

   .. list-table::
       :header-rows: 1
       :widths: 2 5 5

       * - Required
         - Default value
         - Set

       * - Yes
         - ``False``
         - Before installation or application settings afterwards.

.. envvar:: intercom-service/redis/mtls

   Activates the mTLS authentication for the connection to the *Redis* server.
   Set to ``False`` by default.

   .. list-table::
       :header-rows: 1
       :widths: 2 5 5

       * - Required
         - Default value
         - Set

       * - Yes
         - ``False``
         - Before installation or application settings afterwards.

.. envvar:: intercom-service/redis/certificates/mtls/cert

   Defines the host path to the certificate to identify the |ICS| client during
   the mTLS authentication to the *Redis* server. The file must be in |PEM| format.

   .. list-table::
       :header-rows: 1
       :widths: 2 5 5

       * - Required
         - Default value
         - Set

       * - No
         - ``Empty``
         - Only before installation.

.. envvar:: intercom-service/redis/certificates/mtls/key

   Defines the host path to the certificate private key for the mTLS authentication
   of the |ICS| client to the *Redis* server. The file must be in |PEM| format.

   .. list-table::
       :header-rows: 1
       :widths: 2 5 5

       * - Required
         - Default value
         - Set

       * - No
         - ``Empty``
         - Only before installation.

.. envvar:: intercom-service/matrix/url

    Defines the URL, where you can reach the *Matrix* server. The file
    :file:`/etc/ics_matrix_as.secret` stores the Matrix secret.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

        * - Required
          - Default value
          - Set

        * - Yes
          - ``https://matrix.@%@domainname@%@``
          - Only before installation

.. envvar:: intercom-service/matrix/enabled

   Defines if the *Matrix* proxy functionality is enabled. Set to ``False`` to
   disable *Matrix*.

   .. list-table::
       :header-rows: 1
       :widths: 2 5 5

       * - Required
         - Default value
         - Set

       * - Yes
         - ``True``
         - Only before installation

.. envvar:: intercom-service/matrix/server-name

    Defines the server name of the *Matrix* server, that is a
    unique identifier configured in *Matrix*. The server name must match the
    configured server name in *Matrix*.

    It isn't necessarily the server name defined in :envvar:`intercom-service/matrix/url`.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

        * - Required
          - Default value
          - Set

        * - Yes
          - ``matrix.@%@domainname@%@``
          - Only before installation

.. envvar:: intercom-service/matrix/login-type

    Defines the login type that |ICS| uses for the *Matrix* server.

    Refer to the `Matrix <matrix_>`_ documentation for more information about login types.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

        * - Required
          - Default value
          - Set

        * - Yes
          - ``uk.half-shot.msc2778.login.application_service``
          - Only before installation

.. envvar:: intercom-service/matrix/nordeck-mode

    Defines the connection mode of the *Nordeck* bot.

    Possible values: ``test``, ``live``, ``test proxies``.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

        * - Required
          - Default value
          - Set

        * - Yes
          - ``test``
          - Only before installation

.. envvar:: intercom-service/matrix/nordeck-url

    Defines the URL, where you can reach the *Nordeck* bot.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

        * - Required
          - Default value
          - Set

        * - Yes
          - ``https://meetings-widget-bot.@%@domainname@%@``
          - Only before installation

.. envvar:: intercom-service/portal/portal-url

    Defines the URL for the UCS portal. The file :file:`/etc/ics_portal.secret`
    stores the Portal API key.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

        * - Required
          - Default value
          - Set

        * - Yes
          - ``@%@ucs/server/sso/fqdn@%@``
          - Only before installation

.. envvar:: intercom-service/xwiki/url

   Defines the URL where you can reach *XWiki*. Set to empty to disable *XWiki*.

   .. list-table::
       :header-rows: 1
       :widths: 2 5 5

       * - Required
         - Default value
         - Set

       * - Yes
         - ``https://xwiki.@%@domainname@%@``
         - Only before installation

.. envvar:: intercom-service/xwiki/enabled

   Defines the *XWiki* proxy functionality is enabled. Set to ``False`` to
   disable *XWiki*.

   .. list-table::
       :header-rows: 1
       :widths: 2 5 5

       * - Required
         - Default value
         - Set

       * - Yes
         - ``True``
         - Only before installation

.. envvar:: intercom-service/xwiki/audience

   Defines the :term:`OIDC audience` setting for *XWiki* that *XWiki* uses in the :term:`IdP` *Keycloak*.

   .. list-table::
       :header-rows: 1
       :widths: 2 5 5

       * - Required
         - Default value
         - Set

       * - Yes
         - ``xwiki``
         - Only before installation

.. envvar:: intercom-service/nextcloud/audience

   Defines the :term:`OIDC audience` setting for *Nextcloud* that *Nextcloud* uses in the :term:`IdP` *Keycloak*.

   .. list-table::
       :header-rows: 1
       :widths: 2 5 5

       * - Required
         - Default value
         - Set

       * - Yes
         - ``ncoidc``
         - Only before installation

.. envvar:: intercom-service/nextcloud/url

   Defines the URL where you can reach *Nextcloud*. Set to empty to disable *Nextcloud*.

   .. list-table::
       :header-rows: 1
       :widths: 2 5 5

       * - Required
         - Default value
         - Set

       * - Yes
         - ``https://fs.@%@domainname@%@``
         - Only before installation

.. envvar:: intercom-service/nextcloud/enabled

   Defines the *Nextcloud* proxy functionality is enabled. Set to ``False``
   to disable *Nextcloud*.

   .. list-table::
       :header-rows: 1
       :widths: 2 5 5

       * - Required
         - Default value
         - Set

       * - Yes
         - ``True``
         - Only before installation

.. envvar:: intercom-service/nextcloud/origin

   Defines the *Nextcloud* :term:`CORS` setting. Usually this value is the same
   as :envvar:`intercom-service/nextcloud/url`.

   .. list-table::
       :header-rows: 1
       :widths: 2 5 5

       * - Required
         - Default value
         - Set

       * - Yes
         - ``https://fs.@%@domainname@%@``
         - Only before installation

.. envvar:: intercom-service/certificates/external/root-ca-pem

   Defines the host path to self-signed external certificates, allowing for
   secure communication with *Nextcloud*, *Matrix*, *Redis* and *OX App Suite*. The file
   must be in |PEM| format, allowing for multiple certificates in one
   file.

   .. list-table::
       :header-rows: 1
       :widths: 2 5 5

       * - Required
         - Default value
         - Set

       * - No
         - ``Empty``
         - Only before installation

.. envvar:: intercom-service/certificates/external/root-ca-crt

   Defines the host path to self-signed external certificates, allowing for
   secure communication with *Nextcloud*, *Matrix* and *OX App Suite*. The file
   must be in |CRT| format.

   .. list-table::
       :header-rows: 1
       :widths: 2 5 5

       * - Required
         - Default value
         - Set

       * - No
         - ``Empty``
         - Only before installation
