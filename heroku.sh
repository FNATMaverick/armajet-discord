#!/usr/bin/env bash
heroku container:push web -a "$1"
heroku container:release web -a "$1"
