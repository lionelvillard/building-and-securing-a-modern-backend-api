#!/bin/bash

npm install

zip -r app.zip . --exclude bin/* deploy.sh > /dev/null

# Deploy admin in private package
wsk action update $PACKAGE/express-admin app.zip --kind nodejs:6

# Deploy web action as a sequence composition
wsk action update --sequence $PACKAGE/admin /whisk.system/utils/echo,$PACKAGE/express-admin -a raw-http true -a web-export true
