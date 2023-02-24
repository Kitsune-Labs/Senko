FROM node:lts

WORKDIR /senko
COPY package*.json ./
RUN yarn install
COPY tsconfig.json ./

COPY . .

EXPOSE 7777

RUN yarn build

CMD [ "yarn", "start" ]