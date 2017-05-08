#!/bin/bash

zip -r app.zip . --exclude bin/* deploy.sh > /dev/null

# Deploy website in private package
wsk action update $PACKAGE/express-website app.zip --kind nodejs:6

# Deploy web action as a sequence composition
wsk action update --sequence $PACKAGE/website /whisk.system/utils/echo,$PACKAGE/express-website --web raw
