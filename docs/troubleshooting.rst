.. _app-troubleshooting:

***************
Troubleshooting
***************

.. highlight:: console

When you encounter problems with the operation of the :program:`ICS` app,
this chapter providers information where you can look closer into and to get an
impression about what is going wrong.

.. _app-log-files:

Log files
=========

The :program:`ICS` app produces different logging information in different
places.

:file:`/var/log/univention/appcenter.log`
   Contains log information around activities in the App Center.

   The App Center writes ICS relevant information to this file, when you
   run app lifecycle tasks like install, update and uninstall or when you change
   the app settings.

:file:`/var/log/univention/join.log`
   Contains log information from join processes. When the App Center installs
   ICS, the app also joins the domain.

ICS Docker container
   The app uses a custom builder node image. The App
   Center runs the container. You can view log information from the ICS
   Docker container with the following command:

   .. code-block::

      $ univention-app logs ics


:file:`/var/log/apache2/*.log`
    Reverse proxy logs may contain relevant information for queried URLs by :program:`ICS`, for example the status of middleware queries to other components. Please note that for externalized setups, like for example the BMI-UX setup, the queries will be proxied through the external HAproxy and therefore logs will be located in :file:`/var/log/haproxy.log` on the haproxy-server.


Common Problems
===============

.. _app-forgot_protocol:

Failing to provide the protocol (http or https) for middleware relevant URLs like :envar:`intercom-service/nextcloud/url`, :envar:`intercom/portal/portal-url`, :envar:`intercom/matrix/nordeck-url` will lead to an error during the request in the form of:

   .. code-block::

      TypeError: Cannot read properties of null (reading 'split')
        at required (/app/node_modules/requires-port/index.js:13:23)

