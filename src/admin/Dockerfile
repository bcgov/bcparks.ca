# pull official base image
FROM registry.access.redhat.com/ubi7/nodejs-14 AS build-deps
WORKDIR /frontend
ENV PATH ./node_modules/.bin:$PATH

ARG API_TOKEN
ARG REACT_APP_API_BASE_URL
ARG REACT_APP_CMS_BASE_URL
ARG REACT_APP_FRONTEND_BASE_URL
ARG REACT_APP_KEYCLOAK_AUTH_URL
ARG REACT_APP_KEYCLOAK_REALM
ARG REACT_APP_KEYCLOAK_CLIENT_ID
ARG REACT_APP_STAT_HOLIDAY_API

ENV API_TOKEN=${API_TOKEN}
ENV REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}
ENV REACT_APP_CMS_BASE_URL=${REACT_APP_CMS_BASE_URL}
ENV REACT_APP_FRONTEND_BASE_URL=${REACT_APP_FRONTEND_BASE_URL}
ENV REACT_APP_KEYCLOAK_AUTH_URL=${REACT_APP_KEYCLOAK_AUTH_URL}
ENV REACT_APP_KEYCLOAK_REALM=${REACT_APP_KEYCLOAK_REALM}
ENV REACT_APP_KEYCLOAK_CLIENT_ID=${REACT_APP_KEYCLOAK_CLIENT_ID}
ENV REACT_APP_STAT_HOLIDAY_API=${REACT_APP_STAT_HOLIDAY_API}
ENV HOST='0.0.0.0'
# set working directory


# add `/node_modules/.bin` to $PATH

USER 0
RUN yum install -y \
    python \
    python-dev \
    python-pip \
    build-base \
    bash \ 
    git \
    openssh-client
# RUN pip3 install virtualenv

# install app dependencies
# COPY package.json ./
COPY . .
RUN npm install && \
    npm install -g @angular/cli react-scripts@3.4.1
RUN mkdir -p /frontend/node_modules/.cache && \
    chmod 777 /frontend/node_modules/.cache

########################################
### Stage 2 - Production environment ###
########################################
COPY . ./
# RUN npm run build --prod

# FROM registry.access.redhat.com/ubi8/nginx-118 AS runtime
# USER 0
# RUN yum install -y nmap iputils
# RUN mkdir -p /var/cache/nginx/client_temp
# COPY --from=build-deps /frontend/build /opt/app-root/src
# # COPY ./frontend /opt/app-root/src/app
# # COPY ./nginx.conf /etc/nginx/nginx.conf
# COPY ./default.conf /opt/app-root/etc/nginx.default.d/default.conf
# RUN chmod -R 777 /var/cache/nginx/client_temp && \
#     chown -R 1007770000 /var/cache/nginx/ && \
#     chown -R 1007770000 /opt/app-root/src
# USER 1007770000
# CMD ["nginx", "-g", "daemon off;"]
CMD ["npm","start"]