.. _doc-entry:

#####################################
Univention ICS app documentation
#####################################

Welcome to the documentation about the Univention :program:`ICS` app. The
app installs the Intercom Service, and intermediary for communication between applications like Nextcloud, OX and Synapse (Element). This program is required for the functionalities File-picker, Videoconference create and TODO

This documentation is for system administrators who operate the
:program:`ICS` app from Univention App Center connected to the LDAP
directory in Univention Corporate Server (UCS). It covers the following topics:

#. :ref:`app-architecture-overview`
#. :ref:`app-design-decisions`

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

Your feedback is welcome and highly appreciated. If you have comments,
suggestions, or criticism, please `send your feedback
<https://www.univention.com/feedback/?ics-app=generic>`_ for document
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
   bibliography
