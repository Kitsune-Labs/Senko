FROM node:16.10.0

WORKDIR /usr/bot
COPY package*.json ./
RUN yarn install
COPY . .

CMD [ "yarn", "start" ]