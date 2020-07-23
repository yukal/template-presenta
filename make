#!/bin/bash

function PKG_ABSENT {
  return `which "$1" 2>/dev/null | grep -cm1 "$1"`;
}

# Install dependencies globally
if PKG_ABSENT "gulp"; then
  echo "Install Gulp CLI globally"
  sudo npm install gulp-cli -g
fi

if [ "$1" == "dependencies" ]; then
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
else
  if [ ! -d "node_modules" ]; then
    npm install
  fi
fi

gulp build
