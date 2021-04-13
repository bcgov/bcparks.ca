# pull official base image
FROM node:14.16.0-alpine

# set working directory
WORKDIR /web

RUN apk add --update \
    python \
    python-dev \
    py-pip \
    build-base \
	autoconf \
	automake \
	libtool \
	nasm \
    git \
    openssh-client \
    && pip install virtualenv \
    && rm -rf /var/cache/apk/*


# install app dependencies
COPY package.json ./
RUN npm install 
RUN npm install -g gatsby-cli

# add bash to the image
RUN apk add --no-cache bash

# add app
COPY . ./

# start app
CMD ["gatsby", "develop"]
