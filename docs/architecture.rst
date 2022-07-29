.. _app-architecture:

************
Architecture
************

The :program:`ICS` app architecture consists of the following elements:

* The operating environment |UCS| with the App Center and the Docker engine
  running the ICS-Container.

* The ICS software based on nodejs running in the ICS-Container.

* The Keycloak Identity Access Management, which is used by ICS to authenticate sessions and obtain login tokens for applications.

* TODO review?

.. _app-architecture-overview:

Overview
========

:numref:`figure-architecture` shows the architecture with the most important
elements. 

.. _figure-architecture:

.. figure:: /images/architecture.*
   :alt: ICS app architecture

   ICS app architecture

   View focuses on the endpoints of ICS and interacting apps.

:numref:`figure-flowchart-simplified` shows the interaction between browsers, apps, IdP and ICS. 

.. _figure-architecture:

.. figure:: /images/flowcharts.*
   :alt: ICS app flowchart

   ICS app flowchart

   View focuses on the flow from browser login, ICS communication being initied and Action being executed.


The following list describes the elements in more detail.

.. glossary::

   ICS
      The *Intercom-Service* is the main component of this package, it proxies connections between apps in order to conform with CORS and be endpoint independant.

.. _app-design-decisions:

Design decisions
================

The :program:`ICS` app aims to provide a simple way to interact 
TODO
