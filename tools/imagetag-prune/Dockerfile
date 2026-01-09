FROM node:22-slim

COPY package.json .

RUN npm install

COPY *.js ./

CMD [ "npm", "start" ]