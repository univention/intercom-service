FROM gitregistry.knut.univention.de/univention/customers/dataport/upx/container-ucs-base/ucs-base-test-520-dev:v0.6.0 as ucs-base

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
