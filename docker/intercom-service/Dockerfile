# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2024-2025 Univention GmbH

ARG UCS_BASE_IMAGE_TAG=5.2.4-build.20260224@sha256:5d833db38ba5d0abd8160d3989d5ba86967f6fc0c8837a264f8f8ea402803bc4
ARG UCS_BASE_IMAGE=gitregistry.knut.univention.de/univention/dev/projects/ucs-base-image/ucs-base

FROM ${UCS_BASE_IMAGE}:${UCS_BASE_IMAGE_TAG} AS common

# hadolint ignore=DL3008
RUN apt-get update && apt-get install -y --no-install-recommends \
    "curl" \
    "nodejs" \
    "yarnpkg" \
    "ca-certificates" \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . /app

RUN yarnpkg install
###############################################################################
FROM common AS dev

EXPOSE 8008

#ENV DEBUG=express:*
CMD ["nodejs", "app.js"]

###############################################################################
FROM common AS final

RUN \
  apt-get purge -y yarnpkg \
  && apt-get clean autoclean \
  && apt-get autoremove --yes

RUN \
  find /var/lib/apt/lists /var/cache/apt/archives /var/log -type f -delete \
  && rm -rfv /usr/share/doc /usr/share/man /usr/share/locale \
     /usr/share/info /var/cache/apt /var/lib/apt/lists /var/lib/dpkg/*-old

EXPOSE 8008

RUN adduser app
USER app

HEALTHCHECK --interval=60s --timeout=10s --start-period=10s CMD ./healthcheck.sh

CMD ["nodejs", "app.js"]
