FROM node:18.12.1

WORKDIR /senko
COPY package*.json ./
RUN yarn install

COPY . .

CMD [ "yarn", "start" ]