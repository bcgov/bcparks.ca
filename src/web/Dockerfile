# pull official base image
FROM registry.access.redhat.com/ubi8/nodejs-14

# set working directory
# WORKDIR /web
USER 0

RUN yum install -y \
    python3-pip \
    python3 \
	autoconf \
	automake \
	libtool \
    git \
    openssh
RUN chmod -R 777 /opt/app-root/src
RUN pip3 install virtualenv 



# install app dependencies
COPY package.json ./
RUN npm install --unsafe-perm
RUN npm install -g gatsby-cli

# add bash to the image
# RUN apk add --no-cache bash

# add app
COPY . ./

# start app
CMD ["gatsby", "develop"]
