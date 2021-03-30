# pull official base image
FROM node:14.16.0-alpine AS build-deps
ARG REACT_APP_API_BASE_URL
ARG REACT_APP_FRONTEND_BASE_URL
ARG PUBLIC_URL

ENV REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}
ENV REACT_APP_FRONTEND_BASE_URL=${REACT_APP_FRONTEND_BASE_URL}
ENV PUBLIC_URL=${PUBLIC_URL}

# set working directory
WORKDIR /frontend

# add `/node_modules/.bin` to $PATH
ENV PATH ./node_modules/.bin:$PATH

RUN apk add --update \
    python \
    python-dev \
    py-pip \
    build-base \
    bash \ 
    git \
    openssh-client \
    && pip install virtualenv \
    && rm -rf /var/cache/apk/*

# install app dependencies
# COPY package.json ./
COPY . .
RUN npm install && \
    npm install -g @angular/cli react-scripts@3.4.1

# RUN ng build --prod
# add app
COPY . ./
USER 0
RUN mkdir -p /frontend/node_modules/.cache && \
    chmod 777 /frontend/node_modules/.cache
########################################
### Stage 2 - Production environment ###
########################################
# FROM registry.redhat.io/rhel8/nginx-118 AS runtime
# COPY --from=build-deps /frontend /opt/app-root/src
# COPY --from=build-deps /frontend/nginx.conf /etc/nginx/conf.d/bcp_cms.conf

# start app
CMD ["npm", "start"]
# CMD ["sh","-c","nginx -g 'daemon off;'"]
