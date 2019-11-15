
# *Shake it*

You are looking at ***the final project*** of the course ReactJS at SoftUni.

  

This is a SPA (single page application) that relies on MongoDB, ExpressJS, ReactJS and NodeJS (MERN).

___

  
  
  

# Let's get started!

  

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

  

3. Now you are ready to do the final step. In a new Command Prompt navigate to the "client" folder and type

  

```bash

npm start

```

  
  

If everything goes well, a browser window should be opened automatically at http://localhost:3000.

This is the default port on which react applications created by create-react-app run.

(The server run at port 5000.)

  

And you are ready to..

  

# It's time to play around ㋡

Now you can see the project at it's best ㋛ 😊 ㋡

  

[success-img-baby](./yes-very-yes-baby.png)

  

# Code explanation
 
## Client side
This application relies on react-toastify for rendering pop-up messages, a.k.a. notifications.

Client folder consist of two main folders:

+ public
	+ includes index.html file with main element with id "root" which is used to render in it react components.

+ src
	+ includes all used react components
	+ some helpful utilities
	+  static files (such as scc and images) 
	+ App.js combines these react components
	+	index.js is the main file. It is used to render components in the html element with id "root" (at ../public/index.js)
	

## Server side

### here talk about all of the librarires used in the app

Client folder consist of many folders:

+ config
	+ here is all of the configuration that NodeJS libraries need






	The database is running on port 27017 and has a newly created collection called "shake-it-db" with a seeded admin profile.

	Admin credentials:
	- username: admin
	- fancy password: admin



## Everything combined together and explained

### 1. User functionalities
1. Login
2. Register

### 2. Product functionalities
1.  List all
2. List only one
3. Add
4. Edit
5. Delete
6. Like
7. Buy one

### 3. Cart functionalities
1. Add product
2. Increase it's count
3. Remove product
4. Final purchase


# User experience
When starting the application for the first time on the homepage you will see this "Sorry" message since there are no products set by default. You need to login as an admin, then you will see that the header component have changed and a link to Add Product is now present.

[no-products-img](add-url-here)





# Upcoming functionalities..
1. Add articles section
2. Add Google Maps to Contact page
3. Secret stuff ; ) 

### Feel free to follow me for 