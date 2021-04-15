# pull official base image
FROM registry.access.redhat.com/ubi7/nodejs-14
ARG DATABASE_HOST
ARG DATABASE_PORT
ARG DATABASE_NAME
ARG DATABASE_USERNAME
ARG DATABASE_PASSWORD
ARG DATABASE_SSL
ARG PUBLIC_URL

ENV DATABASE_HOST=${DATABASE_HOST}
ENV DATABASE_PORT=${DATABASE_PORT}
ENV DATABASE_NAME=${DATABASE_NAME}
ENV DATABASE_USERNAME=${DATABASE_USERNAME}
ENV DATABASE_PASSWORD=${DATABASE_PASSWORD}
ENV DATABASE_SSL=${DATABASE_SSL}
ENV PUBLIC_URL=${PUBLIC_URL}

# set working directory
# WORKDIR /backend

# add `/node_modules/.bin` to $PATH
ENV PATH ./node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./


RUN npm install --silent
RUN npm run build

# add app
COPY . ./
USER 0
RUN cat ./config/server_template.js | envsubst > ./config/server.js && \
    chmod 766 ./config/server.js && \
    cat ./config/server.js && \
    chmod -R 777 /opt/app-root/src/
# for debugging

# RUN yum install -y nmap iputils postgresql telnet

# start app
CMD [ "npm", "start" ]
