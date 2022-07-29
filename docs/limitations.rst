.. _app-limitations:

****************************
Requirements and limitations
****************************

To ensure a smooth operation of the :program:`ICS` app on |UCS|,
administrators need to know the following requirements and limitations:

.. _limitation_security-issues:

App might have severe security risks
===================================

.. _limitation-primary-node:

Installation on Primary Directory Node
======================================

The App Center installs the :program:`ICS` app only on a Primary Directory
Node in your UCS environment, see :ref:`app-installation`. The app is therefore
not suitable for production use in UCS domains that have Backup Directory Nodes.

.. _limitation_no_logout:

User may be able to continue to use ICS even after a logout attempt
===========================

