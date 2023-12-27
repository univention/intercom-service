# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2023 Univention GmbH

ARG UCS_BASE_IMAGE_TAG=0.10.0
ARG UCS_BASE_IMAGE=gitregistry.knut.univention.de/univention/components/ucs-base-image/ucs-base-520

FROM ${UCS_BASE_IMAGE}:${UCS_BASE_IMAGE_TAG} AS common

RUN apt-get update && apt-get install -y \
    "curl=7.88.1-10+deb12u4" \
    "nodejs=18.13.0+dfsg1-1" \
    "yarnpkg=1.22.19+~cs24.27.18-2"

COPY . /app
WORKDIR /app

RUN yarnpkg install
###############################################################################
FROM common AS dev

COPY . .

EXPOSE 8008

#ENV DEBUG=express:*
CMD ["nodejs", "app.js"]

###############################################################################
FROM common AS final

COPY . .

RUN \
  apt-get purge -y yarnpkg \
  && apt-get clean autoclean \
  && apt-get autoremove --yes

RUN \
  find /var/lib/apt/lists /var/cache/apt/archives /var/log -type f -delete \
  && rm -rfv /usr/share/doc /usr/share/man /usr/share/locale \
     /usr/share/info /var/cache/apt /var/lib/apt/lists /var/lib/dpkg/*-old

EXPOSE 8008

HEALTHCHECK --interval=60s --timeout=10s --start-period=10s CMD ./healthcheck.sh

CMD ["nodejs", "app.js"]
