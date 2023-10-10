.. SPDX-FileCopyrightText: 2022-2023 Univention GmbH
..
.. SPDX-License-Identifier: AGPL-3.0-only

.. _app-architecture:

************
Architecture
************

The |ICS_p| app architecture consists of the following elements:

* The operating environment |UCS| with the App Center and the Docker engine
  running the |ICS| container.

* The |ICS| software based on *Node.js®* running in the |ICS| container.

* The *Keycloak Identity Access Management*, used by |ICS| to authenticate
  sessions and retrieve login tokens for applications.

* A *Redis* container to store |OIDC| sessions.

.. note::

   The following sections may refer to the *browser* rather than to the
   *client* to avoid confusion with |OIDC| clients configured in *Keycloak*.

   *Back end communication* as referred to in the following section isn't related
   to the *Backchannel Logout* path, which is a specific part of the |OIDC|
   protocol.


.. _app-design-decisions:

Design decisions
================

The app |ICS_p| aims to provide a way to facilitate :term:`CORS` conform communication
to different backends directly from the browser. It can proxy, modify, and
authenticate requests and use *Keycloak* as :term:`IdP` and its own session storage to
hold |OIDC| sessions. It acquires those sessions through a silent background
login, provided a valid |OIDC| cookie is already available in the browser.

.. _app-architecture-overview:

Overview
========

Starting from the basics, ignoring everything related to login, authentication,
and sessions for now, this is how |ICS| works on a basic level.

#. The browser opens the intended app.

#. The app contains |ICS| related JavaScript code as part of its responses.

#. This code instructs the browser to send a requests to |ICS|, after the
   browser needs communication to a separate app.

#. |ICS| acts as a middleware to modify and forward those requests appropriately
   to the relevant, second app using a backend communication channel.

#. |ICS| receives the response and finally sends an appropriately modified
   response to the browser.

For a visual representation, refer to :numref:`figure-overview-simple`.

The following list describes how this fits into the wider |OIDC| authentication
scheme. See also :numref:`figure-overview-detail`.

#. The browser starts unauthenticated at the login endpoint of an app that
   supports |ICS|, for example *Matrix*, *Nextcloud*, or *OX App Suite*.

#. The browser follows the |OIDC| login procedure. The app redirects the browser
   to the :term:`IdP` *Keycloak* and upon successful login assigns an |OIDC|
   session for the app to the browser.

#. The browser requests an action, for example to create a video conference, as
   part of a calendar entry. The browser requests an interaction from *OX App
   Suite* to *Matrix*. In detail, the browser requests the *Nordeck* bot that
   runs in the Matrix user frontend *Element*.

#. A silent login happens in the background, that uses the information stored in
   the browser to authenticate |ICS| with the :term:`IdP` *Keycloak* through a
   hidden `IFrame <https://en.wikipedia.org/wiki/HTML_element#Frames>`_.

#. The functional interaction begins as displayed in
   :numref:`figure-overview-simple`.

#. |ICS| sends a requests to the backend, usually another app on UCS. |ICS|
   acts as a middleware between the browser and backends, for example apps.

.. note::

   |ICS| may use shared secrets rather than relying on |OIDC| authentication when
   communicating with backends.

.. warning::

   Back end communication is only safe, if done through HTTPS or a secure
   network. Otherwise, attackers may eavesdrop secrets on application layer.

.. _figure-overview-simple:

.. figure:: /images/overview_no_oidc.png
   :alt: Abstract overview of ICS

   Interactions of |ICS| without |OIDC|

.. _figure-overview-detail:

.. figure:: /images/intercom_detail.*
   :alt: Interactions of ICS with OIDC, OX App Suite and Nordeck

   Interactions of |ICS| with |OIDC|, *OX App Suite* and *Nordeck*

.. raw:: latex

    \clearpage

Portal navigation
=================

.. _figure-portal-cn:

.. figure:: /images/PortalCentralNavigation.*
   :alt: OX Univention-Portal Central Navigation Communication

   Communication overview for the ``Central Navigation`` capability, which
   requires cross app communication between *OX App Suite* and the *UCS Portal*.

.. raw:: latex

    \clearpage


Filepicker
==========

.. _figure-filepicker:

.. figure:: /images/OxFilepickerAuth.*
   :alt: OX Filepicker OIDC communication

   Communication overview for the ``Filepicker`` capability, which requires
   cross-app communication between *OX App Suite* and *Nextcloud*.

.. raw:: latex

    \clearpage

.. _app-endpoints:

Endpoints
=========

The app |ICS_p| offers the API endpoints listed below.

General
-------

``/``
   Alive test only

``/silent``
   Silent |OIDC| login endpoint

``/backchannel-logout``
   Endpoint for |OIDC| back channel logout requests


App specific
------------

``/fs``
   Proxy for *Nextcloud*

``/navigation.json``
   Proxy to Univention-portal for central navigation data

``/nob``
   Proxy for the *Nordeck* bot. In a testing environment, developers can use
   this endpoint to requests to the plain *Matrix* ``UserInfo`` service.

Terms
=====

The document uses the terms that may not be clear to the reader. The following
list provides context and explanation.

.. glossary::

   CORS
      CORS stands for *Cross-Origin Resource Sharing* and is a mechanism that
      allows restricted resources on a web page to be requested from another
      domain outside the domain from which the first resource was served.

      For more information about |CORS|, refer to `Wikipedia: Cross-origin
      resource sharing
      <https://en.wikipedia.org/wiki/Cross-origin_resource_sharing>`_.

   IdP
      stands for *Identity Provider*. An IdP offers user authentication as
      service. In the context of the app |ICS_p| the software *Keycloak* offers
      the IdP service to |ICS| and its app backends.

   OIDC audience
      The |OIDC| audience is a required claim within the ID Token for all OAuth
      2.0 flows used by |OIDC|. According to the specification, it must contain
      the OAuth 2.0 ``client_id`` of the relying party as audience value.

      For more information, see `section ID Token
      <https://openid.net/specs/openid-connect-core-1_0.html#IDToken>`_ in
      :cite:t:`openid-connect-core`.
