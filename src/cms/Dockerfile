# pull official base image
FROM registry.access.redhat.com/ubi7/nodejs-14
ARG DATABASE_HOST
ARG DATABASE_PORT
ARG DATABASE_NAME
ARG DATABASE_USERNAME
ARG DATABASE_PASSWORD
ARG DATABASE_SSL
ARG API_TOKEN
ARG API_USER_NAME
ARG API_USER_EMAIL
ARG API_USER_PASSWORD
ARG ADMIN_USER
ARG ADMIN_PASSWORD
ARG ADMIN_FIRST_NAME
ARG ADMIN_LAST_NAME
ARG ADMIN_EMAIL
ARG REACT_APP_CMS_BASE_URL
ARG ADMIN_JWT_SECRET

ENV DATABASE_HOST=${DATABASE_HOST}
ENV DATABASE_PORT=${DATABASE_PORT}
ENV DATABASE_NAME=${DATABASE_NAME}
ENV DATABASE_USERNAME=${DATABASE_USERNAME}
ENV DATABASE_PASSWORD=${DATABASE_PASSWORD}
ENV DATABASE_SSL=${DATABASE_SSL}
ENV API_TOKEN=${API_TOKEN}
ENV API_USER_NAME=${API_USER_NAME}
ENV API_USER_EMAIL=${API_USER_EMAIL}
ENV API_USER_PASSWORD=${API_USER_PASSWORD}
ENV ADMIN_USER=${ADMIN_USER}
ENV ADMIN_PASSWORD=${ADMIN_PASSWORD}
ENV ADMIN_FIRST_NAME=${ADMIN_FIRST_NAME}
ENV ADMIN_LAST_NAME=${ADMIN_LAST_NAME}
ENV ADMIN_EMAIL=${ADMIN_EMAIL}
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
# COPY . ./
# COPY --chown=1007770000:1007770000 . ./
COPY --chown=default:default . ./

USER 0
RUN yum install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-8-x86_64/pgdg-redhat-repo-latest.noarch.rpm && \
    yum install -y postgresql13
RUN cat ./config/server_template.js | envsubst > ./config/server.js && \
    chmod -R 766 . && \
    cat ./config/server.js && \
    chmod +x ./entrypoint.sh 
# USER default
# start app
# CMD [ "npm", "start" ]
ENTRYPOINT ["./entrypoint.sh"]