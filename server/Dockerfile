FROM node:lts-alpine

WORKDIR /usr/src/app

COPY ./package*.json ./
RUN npm install
COPY . .

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait

EXPOSE 4000
CMD /wait && npm run dev
