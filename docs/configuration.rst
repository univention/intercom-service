.. _app-configuration:

*************
Configuration
*************

The :program:`ICS` app offers various configuration options. Some settings
don't allow changes after installation. Therefore, you must set them carefully
**before** installation. You find those settings marked with *Only before
installation* in :ref:`app-settings`. You can change all other settings at any
time after the installation.

To change settings after installation, sign in to the UCS management system with
a username with administration rights and go to :menuselection:`App Center -->
ICS --> Manage Installation --> App Settings`. On the appearing *Configure
ICS* page, you can change the settings and apply them to the app with a
click on :guilabel:`Apply Changes`.

The App Center then *re-initializes* the Docker container for the ICS app.
*Reinitialize* means the App Center throws away the running ICS Docker
container and creates a fresh ICS Docker container with the just changed
settings.

.. _basic:

ICS
====================================

The :program:`ICS` app provides the backend for inter-app communication of Nextcloud, the Portal, UMC, Synapse (Nordeck) and OX.

.. warning::

   This app does not configure any Keycloak settings, it requires an existing client and realm setup in Keycloak.

.. note::

   This documentation may refer to an IdP or OIDC in general, but UCS currently only supports Keycloak.

.. _app-secrets:

Secrets
=======

The ICS app requires secrets, that are not currently automatically generated. Those secrets are:

.. envvar:: /etc/intercom-client.secret

   The client secret for authenticating with the IdP. This client secret can be retrieved from the Keycloak admin console in the "Authorization"-tab of the intercom-client.


.. envvar:: /etc/intercom.secret

   This secret is an internal secret for the Node-server running intercom. I can be freely chosen.

   .. code-block::

      pwgen -s 30 > /etc/intercom.secret

.. envvar:: /etc/matrix.secret

   The secret for backend-communication with the Matrix server. It can retrieved from the auto-join-app-service on the system running Matrix (MAV).

   .. code-block::

      kubectl exec --stdin --tty synapse-0 -n matrix-000-prod -- \
            /bin/bash -c "cat /data/autojoin-appservice.yaml | \
            grep as_token | \
            sed -e 's/as_token. \(.\+\)/\1/'"

.. envvar:: /etc/portal.secret

   The secret to communicate with the Univention-Portal navigation service. Usually this can be retrieved from "/etc/portal-navigation-service.secret".


.. _app-settings:

Settings
========

The following references show the available settings within the
:program:`ICS` app. Univention recommends to keep the default values.

.. envvar:: intercom/settings/client-id

    Defines the OIDC client name of ICS in Keycloak. The file :file:`/etc/ics_client.secret` stores secret of this client.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

        * - Required
          - Default value
          - Set

        * - Yes
          - ``intercom``
          - Only before installation

.. envvar:: intercom/settings/intercom-url

   Defines the fully qualified URL with protocol, on which ICS is reachable. This needs to be a externally reachable address as it is used by the browser to connect to ICS.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

        * - Required
          - Default value
          - Set

        * - Yes
          - ``https://ics.@%@domainname@%@``
          - Only before installation


.. envvar:: intercom/settings/base-url

   Defines the base-URL used to identify with the IdP. Accordingly this URL must match the base URL set in the OIDC client used on the IdP. Usually this should be the same as `intercom/settings/intercom-url`.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

        * - Required
          - Default value
          - Set

        * - Yes
          - ``https://ics.@%@domainname@%@``
          - Only before installation

.. envvar:: intercom/keycloak/url

   URL of the Keycloak instance to be used as the IdP. This value is ignored if `intercom/settings/issuer-base-url` is set.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

        * - Required
          - Default value
          - Set

        * - Yes
          - ``https://id.@%@domainname@%@``
          - Only before installation

.. envvar:: intercom/keycloak/realm-name

   Name of the realm containing the configured OIDC Intercom client. This value is ignored if `intercom/settings/issuer-base-url` is set.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

        * - Required
          - Default value
          - Set

        * - Yes
          - ``UCS``
          - Only before installation
 
.. envvar:: intercom/settings/issuer-base-url

    Defines a full base URL for the OIDC token issuer. This variable overwrites `intercom-service/keycloak/url` and `intercom-service/keycloak/realm-name`. Only set this variable if you really need to change the default URL generated from the before mentioned variables, this should not be necessary on normal setups.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

        * - Required
          - Default value
          - Set

        * - No
          - ``None``
          - Only before installation

.. envvar:: intercom/settings/origin-regex

   Defines the origin CORS regex. Normally this will be the shared domain name. Changing this value may have security implications.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

        * - Required
          - Default value
          - Set

        * - Yes
          - ``@%@domainname@%@``
          - Only before installation

.. envvar:: intercom-service/settings/proxy

    This setting is passed to node-axios within the container, it allows or disallows connections via proxy server instead of connection to the backends directly.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

        * - Required
          - Default value
          - Set

        * - Yes
          - ``False``
          - Only before installation

.. envvar:: intercom/matrix/url

    Defines the URL on which the Matrix server is reachable. The file :file:`/etc/ics_matrix_as.secret` stores the matrix secret.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

        * - Required
          - Default value
          - Set

        * - Yes
          - ``https://matrix.@%@domainname@%@``
          - Only before installation

.. envvar:: intercom/matrix/server-name

    Defines the server name of the matrix server. The matrix server name is a unique identifier set in matrix, it is not necessarily the server name defined in `intercom/matrix/url`.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

        * - Required
          - Default value
          - Set

        * - Yes
          - ``matrix.@%@domainname@%@``
          - Only before installation

.. envvar:: intercom/matrix/login-type

    Defines the login-type ICS should use on the matrix server. Refer to the Matrix documentation for more information about login types. Normally the default value will be the correct setting.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

        * - Required
          - Default value
          - Set

        * - Yes
          - ``uk.half-shot.msc2778.login.application_service``
          - Only before installation


.. envvar:: intercom/matrix/nodeck-mode

    Defines the connection mode of the Nordeck-bot.

    Possible values
        ``test``, ``live``, ``test proxies``.

    For more information refer to the Nordeck Documentation.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

        * - Required
          - Default value
          - Set

        * - Yes
          - ``test``
          - Only before installation

.. envvar:: intercom/matrix/nodeck-url

    Defines the URL on which Nordeck-bot is listening.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

        * - Required
          - Default value
          - Set

        * - Yes
          - ``https://meetings-widget-bot.@%@domainname@%@``
          - Only before installation

.. envvar:: intercom/portal/portal-url

    Defines the URL on which the Univention-Portal is listening. The file :file:`/etc/ics_portal.secret` stores the Portal API key.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

        * - Required
          - Default value
          - Set

        * - Yes
          - ``@%@ucs/server/sso/fqdn@%@``
          - Only before installation

.. envvar:: intercom/ox/ox-origin

   Defines the OX CORS origin setting. Usually this will be the same as the OX external address.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

        * - Required
          - Default value
          - Set

        * - Yes
          - ``https://webmail.@%@domainname@%@``
          - Only before installation

.. envvar:: intercom/ox/ox-audience

   Defines the OIDC audience settings for the OX token request send to the IdP

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

        * - Required
          - Default value
          - Set

        * - Yes
          - ``oxoidc``
          - Only before installation
    
.. envvar:: intercom-service/nextcloud/url

   Defines the URL on which Nextcloud is listening on.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

        * - Required
          - Default value
          - Set

        * - Yes
          - ``https://fs.@%@domainname@%@``
          - Only before installation
    
.. envvar:: intercom-service/nextcloud/origin

   Defines the Nextcloud CORS origin. Usually this will be the same as  `intercom-service/nextcloud/url`.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

        * - Required
          - Default value
          - Set

        * - Yes
          - ``https://fs.@%@domainname@%@``
          - Only before installation
