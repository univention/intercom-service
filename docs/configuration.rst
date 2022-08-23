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

The app |ICS_p| provides the back end for inter-app
communication of *Nextcloud*, the *UCS Portal*, *UMC*, *Matrix* through the
*Nordeck* bot and *OX App Suite*.

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


:file:`/etc/intercom.secret`
   This secret is an internal secret for the server running |ICS_p|. You can
   choose it freely.

   .. code-block:: console

      $ pwgen -s 30 > /etc/intercom.secret

:file:`/etc/matrix.secret`
   The secret for back end communication with the *Matrix* server. You can
   retrieve it from the automatic join app service on the system running
   *Matrix*.

   The following command shows how to retrieve the secret for the back end
   communication with the *Matrix* server:

   .. code-block:: console

      $ kubectl exec --stdin --tty synapse-0 -n matrix-000-prod -- \
          /bin/bash -c "cat /data/autojoin-appservice.yaml \
          | grep as_token \
          | sed -e 's/as_token. \(.\+\)/\1/'"

:file:`/etc/portal.secret`
   The secret to communicate with the UCS Portal navigation service. You can
   retrieve the secret from :file:`/etc/portal-navigation-service.secret`.


.. _app-settings:

Settings
========

The following references show the available settings within the app
|ICS_p|. Univention recommends to keep the default values.

.. envvar:: intercom/settings/client-id

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

.. envvar:: intercom/settings/intercom-url

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


.. envvar:: intercom/settings/base-url

   Defines the base URL used to identify with the :term:`IdP`. This URL must
   match the base URL defined in the |OIDC| client used on the :term:`IdP`. The
   value should be the same as in :envvar:`intercom/settings/intercom-url`.

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

   URL of the *Keycloak* instance that |ICS| uses as :term:`IdP`. |ICS| ignores
   this value, if :envvar:`intercom/settings/issuer-base-url` is defined.

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

   Name of the realm containing the configured |OIDC| |ICS| client. |ICS| ignore
   this value, if :envvar:`intercom/settings/issuer-base-url` is defined.

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

.. envvar:: intercom/settings/origin-regex

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

.. envvar:: intercom-service/settings/proxy

    This setting is passed to *node-axios* within the container. It allows or
    disallows connections through a proxy server between |ICS| and apps like
    *Matrix*, *Nextcloud*, or *OX App Suite*, instead of a direct connection to
    the back ends.

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

.. envvar:: intercom/matrix/server-name

    Defines the server name of the *Matrix* server, that is a
    unique identifier configured in *Matrix*. The server name must match the
    configured server name in *Matrix*.

    It isn't necessarily the server name defined in :envvar:`intercom/matrix/url`.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

        * - Required
          - Default value
          - Set

        * - Yes
          - ``matrix.@%@domainname@%@``
          - Only before installation

.. FIXME : Add a link to the Matrix documentation, when you refer to it.

.. envvar:: intercom/matrix/login-type

    Defines the login type that |ICS| uses for the *Matrix* server.

    Refer to the Matrix documentation for more information about login types.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

        * - Required
          - Default value
          - Set

        * - Yes
          - ``uk.half-shot.msc2778.login.application_service``
          - Only before installation

.. envvar:: intercom/matrix/nordeck-mode

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

.. envvar:: intercom/matrix/nordeck-url

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

.. envvar:: intercom/portal/portal-url

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

.. envvar:: intercom/ox/ox-origin

   Defines the *OX App Suite* :term:`CORS` setting. Usually, this value is will be the same
   as the *OX App Suite* external address.

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

   Defines the :term:`OIDC audience` setting for *OX App Suite* that *OX App
   Suite* uses in the :term:`IdP` *Keycloak*.

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

   Defines the URL where you can reach *Nextcloud*.

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
