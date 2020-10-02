/**
 In 'package.json' are the following scripts:

 (npm) start         : ./bash-scripts/start.sh
 (npm) stop          : nps end
 (npm run) dev       : nps build.development
 (npm run) dev-disk  : nps build.development.hugo_disk
 (npm run) stage     : nps build.stage
 (npm run) local     : nps build.local
 (npm run) prod      : nps build.production
 (npm run) prod-nomin: nps build.production-nomin
 (npm run) metricsOn : nps helper.metricsOn
 (npm run) metricsOff: nps helper.metricsOff

 */

module.exports = {
  scripts: {

    //----------------------------------------------------------//
    //    Start = ./bash-scripts/start.sh
    //----------------------------------------------------------//
    // 'start.sh' runs 'npm install',
    // 'nps nodecopy' and 'nps copy'.


    //----------------------------------------------------------//
    //    Resets
    //----------------------------------------------------------//
    end: "nps nodereset clean --silent helper.htaccess --silent helper.metricsOff",


    //----------------------------------------------------------//
    //    Builds for Development, Stage, Local and Production
    //----------------------------------------------------------//
    build: {
      // -- Development ----------
      //
      // CSS und JS are compiled by Hugo, the Hugo build includes Drafts
      // Future and Expired. The server is started with Hugo.
      //
      // The website is compiled in RAM.
      // With 'npm run dev-disk' it can also be rendederd on disk.
      // In that case you'll find the files in './public'
      //
      // 'nps copy' and 'nps nodecopy' are started already with 'npm start'.
      development: {
        default: "nps --silent build.development.hugo",

        hugo: "HUGO_ENV=\"DEVELOPMENT\" hugo server -wDEF --disableFastRender --navigateToChanged",
        // Hugo renders to './public'
        hugo_disk: "HUGO_ENV=\"DEVELOPMENT\" hugo server -wDEF --renderToDisk --disableFastRender --navigateToChanged",
      },

      // -- Stage ----------
      // CSS und JS are compiled by Hugo, the Hugo build includes Drafts, Future and Expired.
      //
      // 'nps copy' and 'nps nodecopy' are started already with 'npm start'.
      stage: {
        default: "./bash-scripts/stage.sh",

        hugo: "HUGO_ENV=\"STAGE\" hugo -DEF --config config.toml,configStage.toml -d build/stage",
      },

      // -- Local ----------
      // CSS und JS are compiled by Hugo. The website is compiled in './build/local'.
      // The 'robots.txt' or 'humns.txt' are not needed for this build.
      //
      // 'nps copy' and 'nps nodecopy' are started already with 'npm start'.
      local: {
        default: "nps --silent clean.local build.local.hugo clean.htaccesslocal",

        hugo: "HUGO_ENV=\"LOCAL\" hugo -DEF --config config.toml,configLocal.toml -d build/local",
      },

      // -- Production ----------
      // The script './bash-scripts/production.sh' starts after answering the questions
      // 'clean.public', 'build.production.hugo', 'build.production.minifyHtml' and 'build.production.minifyXml' in series.
      //
      // The website is compiled in './build/public'.
      //
      // 'nps copy' and 'nps nodecopy' are started already with 'npm start'.
      production: {
        default: "./bash-scripts/production.sh",

        hugo: "HUGO_ENV=\"PRODUCTION\" hugo --config config.toml,configPublic.toml -d build/public",

        // Minify HTML and XML
        // https://www.npmjs.com/package/html-minifier
        minifyHtml: "html-minifier --input-dir build/public --output-dir build/public --file-ext html --collapse-whitespace",
        minifyXml: "html-minifier --input-dir build/public --output-dir build/public --file-ext xml --collapse-whitespace",
      },

      // -- Production no Minification ----------
      // The script './bash-scripts/production-nomin.sh' starts after answering the questions
      // 'clean.public' and 'build.productionNomin.hugo'.
      //
      // The website is compiled in './build/public'.
      //
      // 'nps copy' and 'nps nodecopy' are started already with 'npm start'.
      productionNomin: {
        default: "./bash-scripts/production-nomin.sh",

        hugo: "HUGO_ENV=\"PRODUCTION\" hugo --config config.toml,configPublic.toml -d build/public",
      }
    },


    //----------------------------------------------------------//
    //    Copy
    //----------------------------------------------------------//
    copy: {
      default: "nps copy.fav copy.images",

      // Copy Favicons
      fav: "cp ./assets/favicons/* ./static; # [ -f ./static/README.md ]; rimraf ./static/README.md",

      // Copy Images
      images: "cp -r ./assets/images ./static",

      // Copy Font Awesome Webfonts
      webfonts: "cp -r ./assets/scss/vendors/fontawesome-pro/webfonts ./static",

      // .htaccess copy to './static'
      // This task is only called by './bash-scripts/production.sh'
      // and './bash-scripts/stage.sh'
      htaccess: "cp -f ./assets/htaccess-live ./static/.htaccess",
    },


    //----------------------------------------------------------//
    //    Node Modules
    //----------------------------------------------------------//
    // -- nodecopy ----------

    // The silent switch for nodecopy is set in
    // './bash-scripts/start.sh'.
    nodecopy: {
      // Copies the needed JS files to './assets/dependencies'.
      default: "./bash-scripts/nodecopy.sh",
    },

    // -- nodereset ----------
    nodereset: {
      default: "nps --silent nodereset.dependencies",

      // Discards './assets/dependencies'
      dependencies: "rimraf ./assets/dependencies",
    },


    //----------------------------------------------------------//
    //    Cleaning
    //----------------------------------------------------------//
    clean: {
      default: "nps --silent clean.static clean.stage clean.local clean.public clean.disk_public",

      // Empty './static/'
      static: "rimraf ./static/*; rimraf ./static/.htaccess",

      // Empty './build/dev/'
      dev: "rimraf ./build/dev/*",

      // Empty './build/stage/'
      stage: "rimraf ./build/stage/*; rimraf ./build/stage/.htaccess",

      // Empty './build/local/'
      local: "rimraf ./build/local/*",

      // Discard '.htaccess' in './build/local'
      htaccesslocal: "rimraf ./build/local/.htaccess",

      // Empty './build/public/'
      public: "rimraf ./build/public/*; rimraf ./build/public/.htaccess",

      // Discard './public/'
      // Folder was generated by Hugo's render to disk
      disk_public: "[ -d ./public ]; rimraf ./public",

      // Discard './static/.htaccess'
      // Called by './bash-scripts/stage.sh' and
      // './bash-scripts/production.sh'
      htaccess: "[ -f ./static/.htaccess ]; rimraf -f ./static/.htaccess",
    },


    //----------------------------------------------------------//
    //    Helper
    //----------------------------------------------------------//
    helper: {
      // 'robots.txt' is in './layouts' and is processed by Hugo automatically.

      // Testing the Hugo-Site for Performance.
      metricsOn: "./bash-scripts/template-metrics.sh",
      metricsOff: "[ -d ./public ]; rimraf ./public",

      // Open Webbrowser
      open: "open http://localhost:1313",

      // Reset ./assets/htaccess-live
      htaccess: "cp -f ./assets/htaccess-reset assets/htaccess-live",
    },
  },
};
