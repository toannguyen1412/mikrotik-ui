FROM  node:lts-alpine

USER root

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install pm2@latest -g
RUN npm install --only=prod --force

COPY . .

EXPOSE 3000

CMD ["pm2-runtime", "ecosystem.config.js"]