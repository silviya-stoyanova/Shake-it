Sources:

https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Route.md
https://github.com/MacKentoch/react-bootstrap-webpack-ssr-starter
https://github.com/Ovardov/JavaScript-SoftUni/tree/master/ReactJS/E-Commerce
https://github.com/IliaIdakiev/angular-material-timepicker

___


# *Shake it*
You are looking at ***the final project*** of the course ReactJS at SoftUni.

This is a SPA (single page application) that relies on MongoDB, ExpressJS, ReactJS and NodeJS (MERN).
___

## Usage

### 1. Install packages
In the project root open a new terminal and type

```bash
npm install
```

or

```bash
yarn install
```

### 2. Start application
In order to start the application, you need to accomplish several steps:

1. First of all you need to start MongoDB by running mongod.exe. For example, from the Command Prompt:
```bash
"C:\Program Files\MongoDB\Server\3.2\bin\mongod.exe"
```

This starts the main MongoDB database process. The *waiting for connections* message in the console output indicates that the mongod.exe process is running successfully.

2. Then you are ready to run the server

Open a new Command Prompt, navigate to the "server" folder and type:

```bash
nodemon app
```

1. Now you are ready to do the final step. In a new Command Prompt navigate to the "client" folder and type

```bash
npm start
```

And you are ready!

[success-img-baby](./yes-very-yes-baby.png)