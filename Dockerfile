FROM node:lts

WORKDIR /senko
COPY package*.json ./
COPY tsconfig.json ./
RUN yarn install

COPY . .

EXPOSE 7777

CMD [ "yarn", "start" ]