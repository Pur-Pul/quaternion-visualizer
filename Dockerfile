FROM node:22
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .

USER node

RUN npm run build
CMD npm start