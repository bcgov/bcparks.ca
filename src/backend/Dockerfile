# pull official base image
FROM node:14.16.0-alpine

ARG DATABASE_HOST=postgres
ARG DATABASE_PORT=5432
ARG DATABASE_NAME=postgres
ARG DATABASE_USERNAME=postgres
ARG DATABASE_PASSWORD=postgres
ARG DATABASE_SSL=false

ENV DATABASE_HOST=${DATABASE_HOST}
ENV DATABASE_PORT=${DATABASE_PORT}
ENV DATABASE_NAME=${DATABASE_NAME}
ENV DATABASE_USERNAME=${DATABASE_USERNAME}
ENV DATABASE_PASSWORD=${DATABASE_PASSWORD}
ENV DATABASE_SSL=${DATABASE_SSL}

# set working directory
WORKDIR /backend

# add `/node_modules/.bin` to $PATH
ENV PATH ./node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
RUN npm install --silent

# add bash to the image
RUN apk add --no-cache bash

# add app
COPY . ./

# start app
CMD ["npm", "start"]
