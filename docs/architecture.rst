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

.. _app-architecture-overview:

Overview
========


.. _app-design-decisions:

Design decisions
================

The :program:`ICS` app aims to provide a simple way to facilitate CORS-conform communication to different backends directly from the browser. It can proxy, modify and authenticate requests and use Keycloak and its own sessions storage to hold OIDC session. It can acquire those sessions via a silent background login, provided a valid OIDC cookie is already available in the browser.
