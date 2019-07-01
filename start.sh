#!/usr/bin/env bash
source <(curl -s https://raw.githubusercontent.com/paperbenni/bash/master/import.sh)

pb heroku
pb heroku/title

if isheroku; then
    herokutitle "discord" "bot"
fi

cd /home/user
npm install

while :; do
    node .
    sleep 10
done
