# Prerequisites

  * Node.js (recommended 8.x).
  * npm install -g bower grunt-cli


# Installation of packages

  1. cd project_directory (this file's dir)
  2. for server-side packages: npm install
  3. for client-side packages: bower install


# Run application in development mode

  1. grunt serve
  2. open localhost:9000 in browser
  

# Build application

  1. grunt build
  2. Find the build result in the 'dist' sub-folder. In the 'dist' folder you find 'public' (front-end) folder. 'public' folder is a static files of webapp and ready for deploy to webserver.
