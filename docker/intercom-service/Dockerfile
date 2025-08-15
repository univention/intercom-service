# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2024-2025 Univention GmbH

ARG UCS_BASE_IMAGE_TAG=5.2.2-build.20250814@sha256:02036c4d80d8db60e5c8f327fed73ae52bc00ae99c1c459fa73459a2c4c1f93f
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
