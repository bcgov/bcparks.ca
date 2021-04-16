# pull official base image
FROM registry.access.redhat.com/ubi7/nodejs-14
ARG DATABASE_HOST
ARG DATABASE_PORT
ARG DATABASE_NAME
ARG DATABASE_USERNAME
ARG DATABASE_PASSWORD
ARG DATABASE_SSL
ARG REACT_APP_CMS_BASE_URL
ARG ADMIN_JWT_SECRET

ENV DATABASE_HOST=${DATABASE_HOST}
ENV DATABASE_PORT=${DATABASE_PORT}
ENV DATABASE_NAME=${DATABASE_NAME}
ENV DATABASE_USERNAME=${DATABASE_USERNAME}
ENV DATABASE_PASSWORD=${DATABASE_PASSWORD}
ENV DATABASE_SSL=${DATABASE_SSL}
ENV REACT_APP_CMS_BASE_URL=${REACT_APP_CMS_BASE_URL}
ENV ADMIN_JWT_SECRET=${ADMIN_JWT_SECRET}
# set working directory
# WORKDIR /backend

# add `/node_modules/.bin` to $PATH
ENV PATH ./node_modules/.bin:$PATH
USER 1007770000
# install app dependencies
COPY package.json ./


RUN npm install --silent
RUN npm run build

# add app
COPY . ./
USER 0
RUN cat ./config/server_template.js | envsubst > ./config/server.js && \
    chmod 766 ./config/server.js && \
    cat ./config/server.js

RUN chmod -R 777 /opt/app-root/src/ && \
    chown -R 1007770000 /opt/app-root/src/
USER 1007770000
# start app
CMD [ "npm", "start" ]
