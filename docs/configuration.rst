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

The App Center then *reinitializes* the Docker container for the ICS app.
*Reinitilize* means the App Center throws away the running ICS Docker
container and creates a fresh ICS Docker container with the just changed
settings.

.. _basic:

ICS
====================================

The :program:`ICS` app provides the backend for inter-app communication of Nextcloud, the Portal, UMC, Synapse (Nordeck) and OX.

.. warning::

    TODO

.. note::

   TODO

.. _app-settings:

Settings
========

The following references show the available settings within the
:program:`ICS` app. Univention recommends to keep the default values.

.. envvar:: ics/settings/client-id

    Defines the OIDC client name of ICS in keycloak. The file :file:`/etc/ics_client.secret` stores secret of this client.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

    * - Required
      - Default value
      - Set

    * - Yes
      - ``intercom``
      - Only before installation

.. envvar:: ics/settings/intercom-url

   Defines the URL under which ICS is running. TODO wtf is the difference to BASE_URL in container??
   TODO how to set default value??

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

    * - Required
      - Default value
      - Set

    * - Yes
      - ``https://ics.TODO``
      - Only before installation


.. envvar:: ics/settings/base-url

   Defines the BASE URL TODO ???
   TODO how to set default value??

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

    * - Required
      - Default value
      - Set

    * - Yes
      - ``https://ics.TODO``
      - Only before installation

 
.. envvar:: ics/settings/issuer-base-url

    Defines the base URL for the OIDC token issuer: TODO can this be taken from Keycloak app?

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

    * - Required
      - Default value
      - Set

    * - Yes
      - ``https://ics.TODO/auth/realms/<identifier>``
      - Only before installation

.. envvar:: ics/settings/origin-regex

   Defines the origin CORS regex.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

    * - Required
      - Default value
      - Set

    * - Yes
      - ``*``

.. envvar:: ics/matrix/url

    Defines the URL under which the Matrix-Server is reachable. The file :file:`/etc/ics_matrix_as.secret` stores the matrix secret.



    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

    * - Required
      - Default value
      - Set

    * - Yes
      - ``https://matrix.TODO``
      - Only before installation

.. envvar:: ics/matrix/server-name

    Defines the server name of the matrix server.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

    * - Required
      - Default value
      - Set

    * - Yes
      - ``TODO matrix server name``
      - Only before installation

.. envvar:: ics/matrix/login-type

    Defines the login-type ICS should use on the matrix server.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

    * - Required
      - Default value
      - Set

    * - Yes
      - ``uk.half-shot.msc2778.login.application_service``
      - Only before installation


.. envvar:: ics/matrix/nodeck-mode

    Defines the mode of the Nordeck-bot.

    Possible values
        ``test``, ``live``, ``test proxies``.

    For a detailed description of Nordeck modes, refer to TODO cite

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

    * - Required
      - Default value
      - Set

    * - Yes
      - ``test``

.. envvar:: ics/matrix/nodeck-url

    Defines the url on which Nordeck-bot is listening.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

    * - Required
      - Default value
      - Set

    * - Yes
      - ``https://<meetings_widget_bot> todo``

.. envvar:: ics/portal/portal-url

    Defines the URL on which the portal is listening,  The file :file:`/etc/ics_portal.secret` stores the Portal API key.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

    * - Required
      - Default value
      - Set

    * - Yes
      - ``https://portal TODO``

.. envvar:: ics/ox/ox-origin

   Defines the OX origin URL

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

    * - Required
      - Default value
      - Set

    * - Yes
      - ``https:// TODO``

.. envvar:: ics/ox/ox-audience

   Defines the OX communication protocol.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

    * - Required
      - Default value
      - Set

    * - Yes
      - ``oxoidc``
    
.. envvar:: ics/nc/nc-url

   Defines the URL on which Nextcloud is listening on.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

    * - Required
      - Default value
      - Set

    * - Yes
      - ``https://TODO``
    
.. envvar:: ics/nc/nc-origin

   Defines the Nextcloud CORS origin.

    .. list-table::
        :header-rows: 1
        :widths: 2 5 5

    * - Required
      - Default value
      - Set

    * - Yes
      - ``https://TODO``
