FROM image-registry.apps.silver.devops.gov.bc.ca/61d198-tools/node:18-slim

ENV GATSBY_HOME=/gatsby

WORKDIR $GATSBY_HOME

COPY . $GATSBY_HOME

RUN npm install
