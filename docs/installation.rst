.. _app-installation:

************
Installation
************

.. highlight:: console

You can install the :program:`ICS` app like any other app with Univention
App Center. The App Center only allows to install Keycloak on a UCS system with
the system role *Primary Director Node*. For more information, see
:ref:`uv-manual:domain-ldap-primary-directory-node` in :cite:t:`ucs-manual`.

UCS offers two different ways for app installation:

* With the web browser in the UCS management system

* With the command-line

For general information about Univention App Center and how to use it for software
installation, see :ref:`uv-manual:software-appcenter` in :cite:t:`ucs-manual`.

.. _installation-browser:

Installation with the web browser
=================================

To install ICS from the UCS management system, use the following steps:

#. Use a web browser and sign in to the UCS management system.

#. Open the *App Center*.

#. Select or search for *ICS* and open the app with a click.

#. To install ICS, click :guilabel:`Install`.

#. Leave the *App settings* in their defaults or adjust them to your
   preferences. For a reference, see :ref:`app-settings`.

#. To start the installation, click :guilabel:`Start Installation`.

.. note::

   To install apps, the user account you choose for login to the UCS management
   system must have domain administration rights, for example the username
   ``Administrator``. User accounts with domain administration rights belong to
   the user group ``Domain Admins``.

   For more information, see :ref:`uv-manual:delegated-administration` in
   :cite:t:`ucs-manual`.

.. _installation-command-line:

Installation with command-line
==============================

To install the :program:`ICS` app from the command-line, use the following
steps:

#. Sign in to a terminal or remote shell with a username with administration
   rights, for example ``root``.

#. Choose between default and custom settings and run the appropriate
   installation command.

   .. tab:: Default settings

      For installation with default settings, run:

      .. code-block::

         $ univention-app install ics

   .. tab:: Custom settings

      To pass customized settings to the app during installation, run the
      following command:

      .. code-block::

         $ univention-app install --set $SETTING_KEY=$SETTING_VALUE ics

      .. caution::

         Some settings don't allow changes after installation. To overwrite
         their default values, set them before the installation. For a
         reference, see :ref:`app-settings`.

      **Example**: To define a different administration user in ICS, run:

      .. code-block::

         $ univention-app install --set port=8080 TODO other options 
