# this script is for cleaning up database. 
# DO NOT USE ON LIVE SYSTEM
#! /bin/bash
rm -v data.sqlite3
rm -rfv server/files/*

echo "Cleanup successful, restarting..."
npm start