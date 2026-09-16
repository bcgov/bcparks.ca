FROM --platform=linux/amd64 node:24-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY *.js ./

CMD [ "npm", "start" ]