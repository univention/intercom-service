.. _app-changelog:

*********
Changelog
*********

This changelog documents all notable changes to the ICS app. `Keep a
Changelog <https://keepachangelog.com/en/1.0.0/>`_ is the format and this
project adheres to `Semantic Versioning <https://semver.org/spec/v2.0.0.html>`_.

1.1
============

Released: 16. September 2022

Added
-----

* STABILITY: In former |ICS| versions the splitting of cookie headers was executed 
  by a logic that didn't consider certain special cases. 
  Now a standard cookie library is used for the handling. 

* STABILITY: The ICS app now contains a check during app installation, whether the URLs 
  of the required services :program:`Keycloak`, Nextcloud, Nordeck and Univention-Portal are reachable. 
  When services are not reachable a warning is displayed. 
  Additionally, during the ICS operation an ongoing health-check within the container 
  is running to verify every 60 seconds the reachability of the fore-mentioned services.

* Refreshing Access Tokens - implemented a middleware that takes care of 
  automatically refreshing access tokens when they are expired.

* Improved the readability of user documentation. 

Security
--------

* The usage of *Redis* database, which provides persistence for app-sessions 
  is now improved with two security enhancements. 
  First is password protection (provided in ``/etc/intercom-redis.secret``), 
  and the second one is that the Redis container is only accessible 
  from the docker-compose internal network (external: false).

* Every time a JWT access or ID token is used it will now be verified 
  with the public key of the keycloak issuer.

* Enabling backchannel-logout and removing the appropriated app-session from |ICS|.

Fixed
-----

* Fixing bug when PROXY environment variable is set in uppercase - should be 
  lowercase for proper functioning in JS -> When set uppercase it is converted to lowercase.


1.0
===

Released: 22. August 2022

Added
-----

* Initial Release
