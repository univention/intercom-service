FROM node:lts-alpine3.15

COPY . /app
WORKDIR /app

RUN npm install

EXPOSE 8008

CMD ["nodejs", "backend.js"]
