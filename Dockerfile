# old version of node for compability reasons
FROM node:9.9.0-alpine as builder

# additional packages needed for installing certain dependencies
RUN apk add --update python make g++


# Build Production version of LAYA backend
WORKDIR /var/www/laya/backend

COPY package*.json ./
RUN npm install

COPY . .
RUN mkdir server/files

#SET UP DATABASE CORRECTLY FOR THE FIRST TIME
RUN ./first-setup.sh

EXPOSE 3001
CMD ["npm", "start"]