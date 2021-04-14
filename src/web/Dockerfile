# pull official base image
FROM registry.access.redhat.com/ubi8/nodejs-14

# set working directory
# WORKDIR /web
USER 0
# COPY ./web /opt/app-root/src/app
RUN yum install -y \
    python3-pip \
    python3 \
	autoconf \
	automake \
	libtool \
    git \
    openssh && \
    mkdir -p /opt/app-root/src/app/node_modules && \
    mkdir -p /opt/app-root/src/app/site && \
    chmod -R 777 /opt/app-root/src && \
    pip3 install virtualenv 


# install app dependencies
COPY package.json ./
RUN npm install --unsafe-perm 
RUN npm install -g gatsby-cli

# add bash to the image
# RUN apk add --no-cache bash

# add app
COPY . ./
EXPOSE 8000
# start app
CMD ["gatsby", "develop", "-H", "0.0.0.0"]
