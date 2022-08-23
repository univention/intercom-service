.. _app-limitations:

****************************
Requirements and limitations
****************************

To ensure a smooth operation of the app |ICS_p| on |UCS|, administrators need to
know the following requirements and limitations.

.. _limitation-security-issues:

Cross-Site-Request-Forgery protection
=====================================

.. warning::

   |CSRF| protection wasn't extensively tested and may break at any time.

|CSRF| protection may not be working for *Matrix*, *Nextcloud*, and *OX App
Suite* versions released before September 2022.
