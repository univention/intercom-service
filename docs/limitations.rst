.. SPDX-FileCopyrightText: 2022-2026 Univention GmbH
..
.. SPDX-License-Identifier: AGPL-3.0-only

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

|ICS| protects its proxy endpoints against |CSRF| as follows:

* ``/nob`` requires the |CSRF| token for every request, usually in the
  ``X-CSRF-Token`` header. The ``/silent`` page reports the token to the
  embedding page.

* ``/fs`` and ``/wiki`` accept state-changing requests, that means all methods
  except ``GET``, ``HEAD`` and ``OPTIONS``, only with this token, or if the
  browser sent them from |ICS| itself or from a page whose origin matches
  :envvar:`intercom-service/settings/origin-regex`. |ICS| rejects other
  requests with the HTTP status code ``403``.

  |ICS| doesn't check ``GET``, ``HEAD`` and ``OPTIONS`` requests, because they
  must not change any data. For backend actions that change data through
  ``GET`` requests, |ICS| relies on the |CSRF| protection of the backend, for
  example the form token of *XWiki*.
