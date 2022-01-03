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

# create directories for files, including sample courses
ENV FILES_PATH=./server/files
RUN mkdir -p ${FILES_PATH}
RUN mkdir -p ${FILES_PATH}/st0r31d
RUN mkdir -p ${FILES_PATH}/st0r31d700l

# USE SAMPLE DATABASE AS DB
ENV DB_PATH=./server/db
ENV DB_NAME=data.sqlite3
RUN mkdir -p ${DB_PATH}
RUN cp sample-database.sqlite3 ${DB_PATH}/${DB_NAME}

ENV API_PORT=3001
EXPOSE ${API_PORT}
CMD ["npm", "start"]
