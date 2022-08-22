.. _app-architecture:

************
Architecture
************

The :program:`ICS` app architecture consists of the following elements:

* The operating environment |UCS| with the App Center and the Docker engine
  running the ICS-Container.

* The ICS software based on nodejs running in the ICS-Container.

* The Keycloak Identity Access Management, which is used by ICS to authenticate sessions and obtain login tokens for applications.

* A Redis container to store OIDC sessions.

* The following sections may refer to ``the browser`` rather than to ``the client`` to avoid confusion with OIDC clients configured in Keycloak. 
  
* ``Backend communication`` as refered to in the following section is not related to ``Backchannel Logout``, which is a specific OIDC protocol.


.. _app-design-decisions:

Design decisions
================

The :program:`ICS` app aims to provide a simple way to facilitate CORS-conform communication to different backends directly from the browser. It can proxy, modify and authenticate requests and use Keycloak and its own sessions storage to hold OIDC session. It can acquire those sessions via a silent background login, provided a valid OIDC cookie is already available in the browser.

.. _app-architecture-overview:

Overview
========

Starting from the basics, ignoring everything related to login, authentication and sessions for now, this is how ICS works on a basic level.

 * The browser opens the intended app normally.
 * The app contains ICS related (javascript-)code as part of it's normal responses.
 * This code will instruct the browser to send a requests to ICS, once communication to a seperate app is required.
 * The ICS then acts as a middleware to modify and forward those requests appropriatelly to the relevant, second app using a backend communication channel.
 * ICS receives back the response and finally sends an appropriatelly modified response, back to the browser.

Refer to :numref:`figure-overview-simple` for a visual representation.

Let's consider how this fits into the wider OIDC authentication scheme. (see :numref:`figure-overview-detail`)

 * The browser starts unauthenticated at the login endpoint of an ICS supporting app.
 * The browser follows the OIDC login procedure, getting redirected to Keycloak and, assuming successfull login, causing the App and by extension the browser being assinged an OIDC session.
 * The browser requests an action, for example creating a video conference as part of a calendar entry. This means an interaction from OX to Element (more specifically the Nordeck-bot running in element) is requested.
 * Aa silent login happens in the background. This silent login uses the information stored in the browsers to authentication of the ICS with Keycloak via a hidden iframe.
 * The actual functional interaction, displayed simplified in :numref:`figure-overview-simple` already, begins.
 * A requests to the correct backend (usually another univention-app) is sent.
 * ICS acts as a middleware between the browser and the backend (app)

.. note:: ICS may used shared secrets rather can relying on OIDC authentication, when communication with app-backends.

.. warning:: Backend communication is only safe if done via HTTPS or a secured network. Secrets may be exchanged on Application-Layer.

.. _figure-overview-simple:

.. figure:: /images/overview_no_oidc.png
   :alt: ICS Abstract Overview

.. _figure-overview-detail:

.. figure:: /images/intercom_detail.*
   :alt: OX Univention-Portal Central Navigation Communication

.. raw:: latex

    \clearpage


Portal Navigation
=================

.. _figure-portal-cn:

.. figure:: /images/PortalCentralNavigation.*
   :alt: OX Univention-Portal Central Navigation Communication

   Communication overview for the ``Central Navigation`` functionality, which requires cross-app communication between OX and the Univention-portal. 

.. raw:: latex

    \clearpage


Filepicker
==========

.. _figure-filepicker:

.. figure:: /images/OxFilepickerAuth.*
   :alt: OX Filepicker OIDC Communication

   Communication overview for the ``Filepicker`` functionality, which requires cross-app communication between OX and Nextcloud. 

.. raw:: latex

    \clearpage

.. _app-endpoints:

General
=======

.. envvar:: /

   Alive test only

.. envvar:: /silent

   Silent (OIDC) login endpoint

.. envvar:: /backchannel-logout

   Endpoint for OIDC backchannel logout requests


App-Specific
============

.. envvar:: /fs

   Proxy for Nextcloud

.. envvar:: /navigation.json

   Proxy to Univention-portal for central navigation data

.. envvar:: /nob
   
   Proxy for the Nordeck-bot. This endpoint may also be used to send requests to the plain Matrix ``UserInfo``-service in a testing enviroment.
