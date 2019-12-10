# *&copy; Shake it*
 
You are looking at ***the final project*** of the course ReactJS at SoftUni.

This is a single page web application (SPA) that relies on MongoDB, ExpressJS, ReactJS and NodeJS (MERN). It is divided mainly in two parts:
+  public (for all guests)
+  private (for users / **admin**)

It uses the following programming concepts, specific to the React library: client-side routing, stateless and statefull components, bound forms, synthetic events, lifecycle methods, React Hooks, Context API, and so on.

This application is about a company that offers some of the best milkshakes you have ever tried. *Enjoy it!*
___


# Let's get started!
 

### 1. Install packages

When the project is cloned or downloaded, type in the terminal the following in both Server and Client directory:
  
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

3. Now you are ready to do the final step. In a new Command Prompt navigate to folder "client" and type
```bash
npm start
```
If everything goes well, a browser window should be opened automatically at http://localhost:3000. This is the default port on which react applications created by create-react-app run, while the server runs at port 5000.
  

# It's time to play around ㋡
  
### The database is running on port 27017 and has a newly created collection called "shake-it-db" with a seeded admin profile.
 
	 Admin credentials:

	- username: admin
	- fancy password: admin123

Now you can add some products and see my project at it's best ㋛ 😊 ㋡  
[success-img-baby](./yes-very-yes-baby.png)
  
  

# Code explanation

## Client side
  

### The client side of the application relies on the library ReactJS (*a powerful component-based JavaScript library that uses server-side rendering (SSR)*) and also on several other libraries:

1.  **react-dom** - used to access and modify the DOM
2.  **react-router-dom** - provides client-side routing, used to build a single-page web application with navigation without the page refreshing as the user navigates
3.  **react-scripts** - a package that includes scripts and configuration used by create-react-app
4.  **react-toastify** - used to notify the user about their actions
  

### Client folder consist of two main folders:
  
+  **public**
	+ includes index.html file with main element with id "root" which is used to render in it react components.
+  **src**
	+ includes all used react components
	+ some helpful utilities
	+ written tests
	+ static files (such as scc and images)
	+ App.js combines these react components
	+ index.js is the main file. It is used to render components in the html element with id "root" (at ../public/index.js)


## Server side
  
### The server side of the application relies on the framework ExpressJS (*a NodeJS based framework, used to rapidly develop Web apps*) and also on several other libraries:

1.  **body-parser** - used to handle POST requests
2.  **express-session** - to successfully maintain a session on the server
3.  **jsonwebtoken** - for user authorization
4.  **mongoose** - provides schema validation and a way to model data, stored in MongoDB
5.  **multiparty** - parse incoming form data including files
6.  **mv** - this library allows you to move a file from one partition of the hard drive to another
7.  **passport** - for user authentication
8.  **passport-local** - this module goes along with passport, it lets you authenticate using a username and password in Node.js applications.
  

### Let's take a quick look at the server folder. It consist of many folders:

+ **config** - here is all of the configuration that NodeJS libraries need

	+ in auth.js are defined two methods, used as middlewares when performing routing. They rely on the usage of the module "jsonwebtoken"

	+ database.js is used to fulfill the connection to the database (MongoDB)

	+ express.js consist of middlewares which take part in parsing incoming forms' data (POST requests), maintaining session on the server, performing authentication with passport and defining a set of headers that allow the browser and server to communicate.

	+ in passport.js is the configuration of the module with the same name

	+ and last but not least - routes.js - it is used to handle different types of incoming requests, most of them have an authentication middleware

+ **controllers** - include methods used to perform the desired operation

+ **models** - here are defined all mongoose schemas *(they define the structure of the document, default values, validators, etc.)* and models based on them *(they provide an interface to the database for creating, querying, updating, deleting records, etc.)*

+ **upload** - this folder is used to store the uploaded images

+ **utilities** - here is the encryption file that helps storing hashed version of a user's password

+ in **app.js** everything is combined together and the server is started upon the following command: node/nodemon app

## About the tests..

### In this application are used Jest and Enzyme

**1. Jest** - [Jest](https://jestjs.io/) is used as a unit testing framework. It acts as a  test runner, assertion library, provides a good mocking support *(which means it could execute different unit test cases)*  and also Snapshot testing. In short - it executes the test.

**2. Enzyme** - [Enzyme](https://airbnb.io/enzyme/) is a testing library that creates a simpler interface for writing unit tests and make it easier to assert, manipulate, and traverse your React Components' output. It adds additional methods for rendering a  component  finding elements, and  interacting with elements.

If you are willing to run the tests to see if everything goes well, in a new terminal type the following command:
```bash
npm run test
```
When you run this command, Jest will launch in *watch mode*. Every time you save a file, it will re-run the tests, just like how  `npm start`  recompiles the code. The watcher includes an interactive command-line interface with the ability to run all tests, or focus on a search pattern. It is designed this way so that you can keep it open and enjoy fast re-runs.
  
## List of all functionalities
  
### 1. User functionalities

1. Login
2. Register
3. User profile 

### 2. Product functionalities

1. List all
2. List only one
3. Add
4. Edit
5. Delete
6. Like

### 3. Cart functionalities

1. Add product
2. Increase it's count
3. Decrease it's count
4. Remove product
5. Final purchase
  
# User experience

When starting the application for the first time on the homepage you will see this "Sorry" message since there are no products offered by default. You need to login as an admin, then you will see that the header component have changed and a link to Add Product is now present. From there you may add some products. By doing so you will "unlock" the other functionalities...

[no-products-img](add-url-here)
  

# Upcoming functionalities..

1. Add articles section
2. Order functionalities
3. Secret stuff ㋡
  
### Feel free to follow me