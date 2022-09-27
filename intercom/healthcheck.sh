#!/bin/sh

curl --fail "$NC_URL" -o /dev/null -s  && \
    curl --head --fail --silent "$NORDECK_URL" | head -n 1 | grep -q 404 && \
    curl --fail "$PORTAL_URL" -o /dev/null -s \
    || exit 1

if [ -z "${ISSUER_BASE_URL}" ]; then
    curl --fail "$KEYCLOAK_URL/auth/realms/$REALM_NAME" -o /dev/null -s || exit 1
else
    curl --fail "$ISSUER_BASE_URL" -o /dev/null -s || exit 1
fi
