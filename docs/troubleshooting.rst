.. SPDX-FileCopyrightText: 2022-2023 Univention GmbH
..
.. SPDX-License-Identifier: AGPL-3.0-only

.. _app-troubleshooting:

***************
Troubleshooting
***************

.. highlight:: console

When you encounter problems with the operation of the app |ICS_p|, this section
provides information where you can look closer into and to get an impression
about what's going wrong.

.. _app-log-files:

Log files
=========

The app |ICS_p| produces different logging information in different places.

:file:`/var/log/univention/appcenter.log`
   Contains log information around activities in the App Center.

   The App Center writes |ICS| relevant information to this file, when you run
   app lifecycle tasks like install, update and uninstall or when you change the
   app settings.

:file:`/var/log/univention/join.log`
   Contains log information from join processes. When the App Center installs
   |ICS|, the app also joins the domain.

|ICS| Docker container
   The app uses a custom built node image. The App Center runs the container.
   You can view log information from the |ICS| Docker container with the
   following command:

   .. code-block:: console

      $ univention-app logs intercom-service


:file:`/var/log/apache2/*.log`
    Reverse proxy logs may contain relevant information for queried URLs by
    |ICS_p|, for example the status of middleware queries to
    other components.

    .. note::

       For externalized setups, like for example the *BMI-UX* setup, |ICS|
       proxies the queries through the external *HA-Proxy*. Therefore, you can
       find the proxy log files in :file:`/var/log/haproxy.log` on the
       *HA-Proxy* server.


.. _app-forgot-protocol:

Common problems
===============

Failing to provide the protocol, for example HTTP or HTTPS, for middleware
relevant URLs like :envvar:`intercom-service/nextcloud/url`,
:envvar:`intercom/portal/portal-url`, and :envvar:`intercom/matrix/nordeck-url`
leads to an error during the request in the form of:

.. code-block::

   TypeError: Cannot read properties of null (reading 'split')
     at required (/app/node_modules/requires-port/index.js:13:23)
