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
   The app uses a custom builde node image. The App
   Center runs the container. You can view log information from the ICS
   Docker container with the following command:

   .. code-block::

      $ univention-app logs ics

.. _app-debugging:

Debugging
=========

TODO ???
