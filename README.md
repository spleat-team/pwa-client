# Contribution Guide : 

## Technology Review

Servers : NodeJS & Firebase
Client : ReactJS v16.8 (With hooks and context api)
Package Manager : NPM

## NOTE : 
#### This application runs only in mobile mode, if you enter from your computer's browser, activate mobile mode via developer options.

## Getting Started : 
 1. Clone the repository
 2. Navigate to the cloned folder
 3. Run `npm install`
 4. start the application using the following scripts :

## Available Scripts

In the project directory, you can run:

#### `npm run start-dev`

Runs the app in development mode with hot-reloading using react-scripts.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

#### `npm start`

Runs the app using the server in production mode from ```./build```
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

This script is used by heroku when deployed to auto-run the application.

#### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Server Side

We use both firebase and heroku.

Firebase as our login provider and db, and heroku to deploy the application with auto cd from github.

## CI & CD

`master` -> Deployed automatically to [https://spleat-app.herokuapp.com/](https://spleat-app.herokuapp.com/)
