FROM node:16.16.0

WORKDIR /usr/labs/bots/senko
COPY package*.json ./
RUN yarn install

COPY . .

CMD [ "yarn", "start" ]