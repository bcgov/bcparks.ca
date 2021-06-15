# pull official base image
FROM registry.access.redhat.com/ubi8/nodejs-14

ARG STAGING_URL
ARG CMS_URL

ENV STAGING_URL=${STAGING_URL}
ENV CMS_URL=${CMS_URL}

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
USER 1007770000
COPY package.json ./
RUN npm install --unsafe-perm 
RUN npm install -g gatsby-cli

# add bash to the image
# RUN apk add --no-cache bash
    
# add app
COPY . ./
USER 0
RUN chmod -R 777 . && \
    chown -R 1007770000 .
USER 1007770000
EXPOSE 8000
# start app
CMD ["gatsby", "develop", "-H", "0.0.0.0"]
