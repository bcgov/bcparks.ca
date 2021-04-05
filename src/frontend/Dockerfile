# pull official base image
FROM registry.access.redhat.com/ubi7/nodejs-14 AS build-deps
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

# RUN ng build --prod
# add app

RUN mkdir -p /frontend/node_modules/.cache && \
    chmod 777 /frontend/node_modules/.cache
########################################
### Stage 2 - Production environment ###
########################################
COPY . ./
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build-deps /frontend/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
