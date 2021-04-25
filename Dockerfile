# Filename: Dockerfile
# Use: Build a Docker Container
# Creator: cmc
# Date: January 16, 2021

# old version of node for compability reasons
FROM node:9.9.0-alpine as builder

# additional packages needed for installing certain dependencies
RUN apk add --update python make g++


# Build Production version of LAYA backend
WORKDIR /laya-backend

COPY package*.json ./
RUN npm install

COPY . .

# uncomment next 3 lines in fresh clone
# RUN mkdir server/files
# RUN mkdir server/files/st0r31d
# RUN mkdir server/files/st0r31d700l

# USE SAMPLE DATABASE AS DB
RUN mv sample-database.sqlite3 data.sqlite3

EXPOSE 3001
CMD ["npm", "start"]