#!/bin/bash

if [ "$#" -lt 1 ]; then
    echo "Usage: deploy.sh <config> [<packagename>]"
    exit 1
fi

if [ ! -f $1 ]; then
    echo "config file not found!"
    exit 1
fi

CONFIG=$1
PACKAGE=${2-movieanalyst}

# Create public package for web actions
wsk package update $PACKAGE

# install action and configuration file
cp -f $CONFIG movieanalyst-website/config.json
cp -f $CONFIG movieanalyst-api/config.json
cp -f $CONFIG movieanalyst-admin/config.json
cp -f action.js movieanalyst-website/action.js
cp -f action.js movieanalyst-api/action.js
cp -f action.js movieanalyst-admin/action.js

# deploy website
(cd movieanalyst-website; . ./deploy.sh)

# deploy api
(cd movieanalyst-api; . ./deploy.sh)

# deploy admin
(cd movieanalyst-admin; . ./deploy.sh)
