#!/bin/bash

set -eu

BUCKET_FULL_PATH=$1

# sounds
mv sounds sounds_bak | exit 0
aws s3 sync $BUCKET_FULL_PATH/sounds sounds

# music
mv music music_bak | exit 0
aws s3 sync $BUCKET_FULL_PATH/music music

echo "Complete"
