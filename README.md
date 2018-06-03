This application was created with help of  
[Angular FullStack Generator](https://github.com/angular-fullstack/generator-angular-fullstack)  

IMPORTANT!  
The generator's version is 3.6.1.  

To install the generator use the following command:  
npm install -g bower yo gulp-cli generator-angular-fullstack@3.6.1  
NOTE: the generator is not required for building the application, only for the development.


# Prerequisites

  * Node.js (recommended 6.x).
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

# Run built production version in Docker container

  1. build the application as shown above
  2. cd dist
  3. run: docker build -t webstarter .
  4. run: docker run -d -p 8080:8080 --name starter webstarter
  5. Now you can open your browser at Your_VM_IP:8080 and see the application's main page
