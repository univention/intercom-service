ARG UCS_BASE_IMAGE_TAG=v0.7.0
ARG UCS_BASE_IMAGE=gitregistry.knut.univention.de/univention/components/ucs-base-image/ucs-base-520

FROM ${UCS_BASE_IMAGE}:${UCS_BASE_IMAGE_TAG}

RUN apt-get update && apt-get install -y \
    curl \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

COPY . /app
WORKDIR /app

RUN npm install

EXPOSE 8008

HEALTHCHECK --interval=60s --timeout=10s --start-period=10s CMD ./healthcheck.sh

# ENV DEBUG=express:*
CMD ["nodejs", "app.js"]
