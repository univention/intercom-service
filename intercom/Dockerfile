FROM node:lts-alpine3.15

COPY . /app
WORKDIR /app

RUN npm install

EXPOSE 8008

RUN apk --no-cache add curl

HEALTHCHECK --interval=60s --timeout=10s --start-period=10s CMD ./healthcheck.sh

# ENV DEBUG=express:*
CMD ["nodejs", "app.js"]
