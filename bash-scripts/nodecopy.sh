#!/usr/bin/env bash

if [ -d "assets/dependencies" ]
  then rm -rf ./assets/dependencies
fi

# Make dependencies directory inside assets and copy dependencies if directory does not exist
if [ ! -d "assets/dependencies" ]
  then
    mkdir assets/dependencies

    # Copy dependencies
    #

    # https://github.com/sindresorhus/modern-normalize
    # modern-normalize is imported by ./assets/scss/base/_reset.scss
    cp -f node_modules/modern-normalize/modern-normalize.css assets/dependencies/_modern-normalize.scss

    # Hamburgers see https://jonsuh.com/hamburgers/
    cp -f node_modules/hamburgers/dist/hamburgers.min.css assets/dependencies/_hamburgers.scss

    echo ------------------------------
    echo Dependancies copied!
    echo ------------------------------
    echo
fi
