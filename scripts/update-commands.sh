#!/bin/bash

set -eu

SERVER_ID=$1

node scripts/undeploy-commands.js $SERVER_ID
node scripts/deploy-commands.js $SERVER_ID
