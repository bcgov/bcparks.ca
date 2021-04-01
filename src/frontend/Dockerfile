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

# RUN mkdir -p /frontend/node_modules/.cache && \
#     chmod 777 /frontend/node_modules/.cache
RUN npm run build --prod
########################################
### Stage 2 - Production environment ###
########################################
FROM registry.redhat.io/rhel8/nginx-118 AS runtime
# COPY --from=build-deps /frontend/build /opt/app-root/src/bcparks
COPY --from=build-deps /frontend/build /opt/app-root/src
COPY --from=build-deps /frontend/nginx.conf /etc/nginx/conf.d/bcp_cms.conf
COPY --from=build-deps /frontend /opt/app-root/src/frontend
COPY --from=build-deps /frontend/node_modules /opt/app-root/src/frontend/node_modules
      # - "./frontend/node_modules:/app/node_modules"
USER 0
RUN chmod -R 777 /opt/app-root/src
# start app
# CMD ["npm", "start"]
CMD ["sh","-c","nginx -g 'daemon off;'"]
