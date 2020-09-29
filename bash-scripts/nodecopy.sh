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
    # SmoothScroll see https://github.com/alicelieutier/smoothScroll#readme
    # Here's another example: './node_modules/smoothscroll/example.html'
    # cp -rf node_modules/smoothscroll/smoothscroll.js assets/dependencies

    # https://github.com/sindresorhus/modern-normalize
    # modern-normalize is imported by ./assets/scss/base/_reset.scss
    cp -f node_modules/modern-normalize/modern-normalize.css assets/dependencies/_modern-normalize.scss

    # Swiper see https://swiperjs.com/
    # Image swiper
    cp -fr node_modules/swiper assets/dependencies

    # Hamburgers see https://jonsuh.com/hamburgers/
    cp -f node_modules/hamburgers/dist/hamburgers.min.css assets/dependencies/_hamburgers.scss


    # Colors: https://github.com/mrmrs/colors
#    cp -f node_modules/colors.css/src/colors.css assets/dependencies/_colors.scss
#    cp -f node_modules/colors.css/src/_variables.css assets/dependencies/_variables.scss
#    cp -f node_modules/colors.css/src/_skins.css assets/dependencies/_skins.scss
    # Search './_' in '_colors.scss' and replace with nothing (replace string would go between the 2 slashes)
#    sed -i.bak 's/.\/_//' assets/dependencies/_colors.scss
#    rm -f assets/dependencies/_colors.scss.bak

    # Lazy Loading Images: http://dinbror.dk/blog/blazy/?ref=github
    # See also './node_modules/blazy/example/index.html'
#    cp -f node_modules/blazy/blazy.js assets/dependencies

    # Sass-Rem https://github.com/pierreburel/sass-rem
    # .demo {
        # font-size: rem(24px); // Simple
        # padding: rem(5px 10px); // Multiple values
        # border-bottom: rem(1px solid black); // Multiple mixed values
        # box-shadow: rem(0 0 2px #ccc, inset 0 0 5px #eee); // Comma-separated values
        # text-shadow: rem(1px 1px) #eee, rem(-1px) 0 #eee; // Alternate use
      # }
#    cp -f node_modules/sass-rem/_rem.scss assets/dependencies

    echo ------------------------------
    echo Dependancies copied!
    echo ------------------------------
    echo
fi
