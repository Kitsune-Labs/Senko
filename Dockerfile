FROM node:18.12.1

WORKDIR /usr/labs/bots/senko
COPY package*.json ./
RUN yarn install

COPY . .

CMD [ "yarn", "start" ]