.. SPDX-FileCopyrightText: 2022-2023 Univention GmbH
..
.. SPDX-License-Identifier: AGPL-3.0-only

.. _doc-entry:

########################
UCS Intercom Service app
########################

Welcome to the documentation about the Univention app |ICS_p|. The app installs
the |ICS|, an intermediary for communication between applications
like *Nextcloud*, *OX App Suite*, *XWiki* and *Matrix*. The functionalities
*File-picker*, *Video conference*, create and accessing the *Univention-Portal
navigation* endpoint from other apps and *Univention-Portal* news feed
require the app |ICS_p|.

This documentation is for system administrators who operate the app |ICS_p| from
Univention App Center connected to the LDAP directory in |UCS|. It covers the
following topics:

#. :ref:`app-architecture`
#. :ref:`app-installation`
#. :ref:`app-configuration`
#. :ref:`app-limitations`
#. :ref:`app-troubleshooting`

This documentation doesn't cover the following topics:

* Usage of |UCS|, see :cite:t:`ucs-manual`.

To understand this documentation, you need to know the following concepts and
tasks:

* Use and navigate in a remote shell on Debian GNU/Linux derivative Linux
  distributions like |UCS|. For more information, see `Shell and Basic Commands
  <deb-admin-handbook-shell_>`_ from *The Debian Administrator's Handbook*,
  :cite:t:`deb-admin-handbook-shell`.

* :ref:`Manage an app through Univention App Center
  <uv-manual:computers-softwareselection>` in :cite:t:`ucs-manual`.

The app |ICS_p| supports *Keycloak* as :term:`IdP`. In the context of this
document, the term *IdP* is synonymous for *Keycloak* in the context of an *IdP*
in |OIDC|.

Your feedback is welcome and highly appreciated. If you have comments,
suggestions, or criticism, please `send your feedback
<https://www.univention.com/feedback/?intercom-service-app=generic>`_ for document
improvement.

.. toctree::
   :maxdepth: 1
   :numbered:
   :hidden:

   installation
   configuration
   architecture
   limitations
   troubleshooting
   changelog
   bibliography
