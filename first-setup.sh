#! /bin/sh

#this script is used to build the database correctly 
# only neccessary for first time setup
node . &
last_pid=$!
echo $last_pid
kill -KILL $last_pid