FROM node:hydrogen-alpine3.21

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

RUN rm -rf ./src

EXPOSE 5000

CMD ["npm", "run", "start"]