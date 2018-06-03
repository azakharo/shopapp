# Prerequisites

  * Node.js (recommended 8.x).
  * MongoDB (recommended 3.x).
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
  2. Find the build result in the 'dist' sub-folder. In the 'dist' folder you find 'public' (front-end) and 'server' (back-end) folders. 'dist' folder is ready for deploy to target machine.


# Run application in production mode

  1. cd into 'dist' subfolder
  2. set NODE_ENV=production
  3. node server/app.js
  4. open localhost:8080 in browser
