FROM node:lts-alpine as builder

#RUN apk add --update g++ git python python-dev build-base sqlite sqlite-dev gcc make && rm -rf /var/cache/apk/*

#RUN npm install -g sqlite3

# Build Production version of LAYA backend
WORKDIR /var/www/laya/backend

COPY package*.json ./
RUN npm ci

COPY . .


EXPOSE 3001
CMD ["npm", "start"]



