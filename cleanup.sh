# Filename: cleanup.sh
# Use: this script is for cleaning up database in development
#       DO NOT USE ON LIVE SYSTEM
# Creator: cmc
# Date: September 23, 2020
#! /bin/bash

# remove fucked up database
rm -v data.sqlite3
rm -rfv server/files/*

# copy sample database under new name
cp sample-database.sqlite3 data.sqlite3

echo "Cleanup successful, restarting..."
npm start
