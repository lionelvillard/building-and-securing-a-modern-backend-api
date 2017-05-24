#!/bin/bash

npm install

zip -r app.zip . --exclude bin/* deploy.sh > /dev/null

# Deploy website in private package
wsk action update $PACKAGE/express-api app.zip --kind nodejs:6

# Deploy web action as a sequence composition
wsk action update --sequence $PACKAGE/api /whisk.system/utils/echo,$PACKAGE/express-api -a raw-http true -a web-export true
