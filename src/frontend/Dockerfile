# pull official base image
FROM node:14.16.0-alpine

# set working directory
WORKDIR /frontend

# add `/node_modules/.bin` to $PATH
ENV PATH ./node_modules/.bin:$PATH

RUN apk add --update \
    python \
    python-dev \
    py-pip \
    build-base \
    git \
    openssh-client \
    && pip install virtualenv \
    && rm -rf /var/cache/apk/*

# install app dependencies
COPY package.json ./
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g

# add bash to the image
RUN apk add --no-cache bash

# add app
COPY . ./

# start app
CMD ["npm", "start"]
