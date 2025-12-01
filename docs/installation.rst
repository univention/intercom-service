.. SPDX-FileCopyrightText: 2022-2025 Univention GmbH
..
.. SPDX-License-Identifier: AGPL-3.0-only

.. _app-installation:

************
Installation
************

.. highlight:: console

You can install the app |ICS_p| like any other app with Univention App Center.

UCS offers two different ways for app installation:

* With the web browser in the UCS management system

* With the command-line

For general information about Univention App Center and how to use it for
software installation, see :ref:`uv-manual:software-appcenter` in
:cite:t:`ucs-manual`.

.. _app-prerequisites:

Prerequisites
=============

Installing this app has various prerequisites:

#. |ICS| supports |OIDC|. *Nextcloud (>=23.0)* and *OX App Suite (>=7.10.6)*
   must authenticate through |OIDC|, as well.

#. For working |CSRF| protection all other apps need to be up to date.

#. |ICS| requires the *Nordeck* bot up and running for Matrix.

#. |ICS| requires its three secrets before installation, see :ref:`app-secrets` for
   details.

#. |ICS| requires a configured *Keycloak* (>=12.0), including a valid Intercom
   |OIDC| client before installation.


Add ICS client to IdP
=====================

To prepare the existing :term:`IdP` for the installation of the app |ICS_p|, use
the following steps:

#. Enter the *Keycloak Admin Console*.

#. Go to your realm where you want to create the |ICS| client.

#. Create a |OIDC| Client. Recommendation is to use the default value
   ``intercom`` for the *Client ID* and leave the *Root URL* empty and save it.

   During app installation, |ICS_p| asks for the *Client ID*.

#. Set *Client authentication* to ``On``.

#. Set *Authorization*,
   *Service Accounts Enabled*,
   and *Standard Token Exchange*
   to ``On``.

#. Set *Front channel logout* to ``Off``.

#. Set *Backchannel logout URL* to your intended domain for |ICS| with protocol
   and append the ``backchannel-logout`` path, for example:

   .. code-block::

      https://ics.example-domain.example-tld/backchannel-logout

   This step requires *Keycloak* >=12.0.0.

#. Set *Backchannel logout session required* to ``On``.

#. Set the valid redirect URL to your intended |ICS| domain with protocol and
   append the ``/callback`` path, for example:

   .. code-block::

      https://ics.example-domain.example-tld/callback

#. Go to the tab *Credentials*, copy the secret and save it to
   :file:`/etc/intercom-client.secret`.

#. Go to the tab *Client Scopes* and
   add change ``offline_access`` to *Default*.

#. Make sure the *Access Token* includes a mapper for both the username and
   the user unique identifier. The documentation for these claims can be found
   in the *UCR* variables :envvar:`intercom-service/settings/username-claim` and
   :envvar:`intercom-service/settings/user-unique-mapper`.

.. _installation-browser:

Installation with the web browser
=================================

To install |ICS| from the UCS management system, use the following steps:

#. Use a web browser and sign in to the UCS management system.

#. Open the *App Center*.

#. Select or search for *Intercom Service* and open the app with a click.

#. To install *Intercom Service*, click :guilabel:`Install`.

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

To install the app |ICS_p| from the command-line, use the following steps:

#. Sign in to a terminal or remote shell with a username with administration
   rights, for example ``root``.

#. Choose between default and custom settings and run the appropriate
   installation command.

   .. tab:: Default settings

      For installation with default settings, run:

      .. code-block::

         $ univention-app install intercom-service

   .. tab:: Custom settings

      To pass customized settings to the app during installation, run the
      following command:

      .. code-block::

         $ univention-app install --set $SETTING_KEY=$SETTING_VALUE intercom-service

      .. caution::

         Some settings don't allow changes after installation. To overwrite
         their default values, set them before the installation. For a
         reference, see :ref:`app-settings`.

      **Example**: To define a different Keycloak-realm in ICS, run:

      .. code-block::

         $ univention-app install intercom-service \
           --set intercom-service/keycloak/realm-name=master
