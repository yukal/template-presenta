#!/bin/bash

ISODATE=`date --iso-8601`
DIRNAME=${PWD##*/}
SRCNAME="${DIRNAME}-src"

function PKG_ABSENT {
  return `which "$1" 2>/dev/null | grep -cm1 "$1"`;
}

function GET_SOURCE_FILES {
  ls -AB -I ".git" -I "node_modules" -I "${SRCNAME}*"
}

# Install dependencies globally
if PKG_ABSENT "gulp"; then
  echo "Install Gulp CLI globally"
  sudo npm install gulp-cli -g
fi

case "$1" in
  "dependencies")
    echo "Install Gulp plugins locally"
    npm install --save-dev \
      gulp \
      gulp-load-plugins \
      gulp-rename \
      gulp-rigger \
      gulp-sass \
      gulp-clean \
      gulp-uglify \
      browser-sync
  ;;

  "7z")
    7z a "${SRCNAME}-${ISODATE}.7z" `GET_SOURCE_FILES`
    ls -l | grep --color "${SRCNAME}-${ISODATE}.7z"
  ;;

  "zip")
    zip -r "${SRCNAME}-${ISODATE}.zip" `GET_SOURCE_FILES`
    ls -l | grep --color "${SRCNAME}-${ISODATE}.zip"
  ;;

  "tar")
    tar czf "${SRCNAME}-${ISODATE}.tar.gz" $(GET_SOURCE_FILES)
    ls -l | grep --color "${SRCNAME}-${ISODATE}.tar.gz"
  ;;

  *)
    if [ ! -d "node_modules" ]; then
      npm install
    fi
    gulp build
  ;;
esac
