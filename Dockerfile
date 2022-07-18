FROM node:16.16.0

WORKDIR /usr/labs/bots

RUN yarn install

COPY . .

CMD [ "yarn", "start" ]