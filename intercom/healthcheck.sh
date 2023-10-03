#!/bin/bash

# Abort on nonzero exitstatus [-e]
set -o errexit
# Abort on unbound variable [-u]
set -o nounset
# Don't hide errors within pipes
set -o pipefail

# Test variables which should not be empty
check_required_variables() {
  var_names=(
    "NC_URL"
    "NORDECK_URL"
    "PORTAL_URL"
  )
  for var_name in "${var_names[@]}"; do
    if [[ -z "${!var_name:-}" ]]; then
      echo "ERROR: '${var_name}' is unset."
      var_unset=true
    fi
  done

  if [[ -n "${var_unset:-}" ]]; then
    exit 1
  fi
}

check_required_variables

curl --fail "${NC_URL}" -o /dev/null -s  && \
    curl --head --fail --silent "${NORDECK_URL}" | head -n 1 | grep -q 404 && \
    curl --fail "${PORTAL_URL}" -o /dev/null -s \
    || exit 1

if [[ -z "${ISSUER_BASE_URL}" ]]; then
    curl --fail "${KEYCLOAK_URL}/auth/realms/${REALM_NAME}" -o /dev/null -s || exit 1
else
    curl --fail "${ISSUER_BASE_URL}" -o /dev/null -s || exit 1
fi
