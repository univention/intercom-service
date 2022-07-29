.. _app-configuration:

*************
Configuration
*************

The :program:`ICS` app offers various configuration options. Some settings
don't allow changes after installation. Therefore, you must set them carefully
**before** installation. You find those settings marked with *Only before
installation* in :ref:`app-settings`. You can change all other settings at any
time after the installation.

To change settings after installation, sign in to the UCS management system with
a username with administration rights and go to :menuselection:`App Center -->
ICS --> Manage Installation --> App Settings`. On the appearing *Configure
ICS* page, you can change the settings and apply them to the app with a
click on :guilabel:`Apply Changes`.

The App Center then *reinitializes* the Docker container for the ICS app.
*Reinitilize* means the App Center throws away the running ICS Docker
container and creates a fresh ICS Docker container with the just changed
settings.

.. _basic:

ICS
====================================

The :program:`ICS` app TODO

.. warning::

    TODO

.. note::

   TODO

.. _app-settings:

Settings
========

The following references show the available settings within the
:program:`ICS` app. Univention recommends to keep the default values.

ICS has a lot more possibilities for configuration and customization. For
more information, consult :cite:t:`ics-docs`.


.. envvar:: TODO

