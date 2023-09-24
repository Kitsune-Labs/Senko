FROM node:lts

WORKDIR /senko
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 7777
CMD ["npm", "start"]
