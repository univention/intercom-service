# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2024-2025 Univention GmbH

ARG UCS_BASE_IMAGE_TAG=5.2.5-build.20260409@sha256:bda91ebe271000f2d0cef9726f34f9631cabbad71a0b5635aeefd8e6abc0638d
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
