# AppIt Backend Test

## 1. Setup 
Clone this repository and `cd` into it. 

### 1a. Install Dependencies
run  `npm install` on CLI to install all the dependencies. 

### 1b. Config
create a `.env` in the root repository. the contents of the file should be as follows

```
NODE_ENV = development
PORT = 5000
MONGO_URI = mongodb+srv://ritviksingh:IC-41138k@atlas-cluster.xwbax.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
JWT_SECRET = abc123
WEATHER_API_KEY = a7ecd21c09d1814158499c8d92638248
```

The credentials above may be used as it is in the .env file. Alternatively, you can use your own `WEATHER_API_KEY`. 


However,`MONGO_URI` should not be changed since a cluster has been provisioned on `MongoDB Atlas` to which connection may not be establised unless above credentials are used. 

### Starting the application 

run `npm start` in the project root to start the server. The start command starts the entrypoint through the command `nodemon server.js`

## 2. Using the server

### 2a) DB Model
The database consists of 2 colletions namely `users` and `weathers`. 

`users` is used to store the user's information such as  `name, email, and password`. 

Note that password is stored in hashed form using `bcrpytjs`.

`weathers` is used to store weather record documents and the schema is the same as that returened from the API. 

There is a one to many relation between users and weathers ie. the API will store and retreive weather records requested by one particular user. 

### 2b) Register User.

First of all, a user needs to be registered. By default, once a user is registered, he will be logged in. 

The request should be a POST request to the endpoint `http://{yoururl}/api/user` and the body of the request should contain the following

```
{
    "name": "Name",
    "email": "name@gmail.com",
    "password": "password123"
}
```

The response will contain the authorisation token issued and will be something like. 

```
{
    "_id": "61bf5e69fbc22e7e3fcdeff7",
    "name": "Name",
    "email": "name@gmail.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYmY1ZTY5ZmJjMjJlN2UzZmNkZWZmNyIsImlhdCI6MTYzOTkzMTQ5NywiZXhwIjoxNjQyNTIzNDk3fQ.BcNPtL8kcpSlwNhtklA4XjMVYZqPPkLUwOJBenC3l3g"
}
```


Note that this token should be used to issue susequent requests to the protected routes which will be subsequenlty discussed. 


### 2c) Log in User

The request should be a POST request to the endpoint `http://{yoururl}/api/user/login` and the body of the request should contain the following

```
{
    "email": "name@gmail.com",
    "password": "password123"
}
```

A succesful resposne would contain the authorisation token for this user and would look something like

```
{
    "_id": "61bf5e69fbc22e7e3fcdeff7",
    "name": "Name",
    "email": "name@gmail.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYmY1ZTY5ZmJjMjJlN2UzZmNkZWZmNyIsImlhdCI6MTYzOTkzMTkzOSwiZXhwIjoxNjQyNTIzOTM5fQ.5uAUlmG_rQaYwF1a4baIF740wnyJMJShLD7R2ySXK5Q"
}
```

### 2d) Get user info [PROTECTED]

This is a protected route ie. can only be accessed woth a valid Bearer token. It will retreive the information of the loggen in user. So, in order to test the API route, the token of the logged in user must be passed in the GET request to `http://{yoururl}/api/user/profile` in the authorisation header and must be preceede by the string  "Bearer "

The response would look something like

```
{
    "_id": "61bf66c60224eb84149214ef",
    "name": "Name",
    "email": "name@gmail.com"
}
```


Incase the request is made without the authorisation request header set, it will result in a response as below

```
{
    "message": "Not authorized, no token",
    "stack": "Error: Not authorized, no token\n    at file:///Users/pattharock/Desktop/appit/middleware/authMiddleware.js:28:11\n    at asyncUtilWrap (/Users/pattharock/Desktop/appit/node_modules/express-async-handler/index.js:3:20)\n    at Layer.handle [as handle_request] (/Users/pattharock/Desktop/appit/node_modules/express/lib/router/layer.js:95:5)\n    at next (/Users/pattharock/Desktop/appit/node_modules/express/lib/router/route.js:137:13)\n    at Route.dispatch (/Users/pattharock/Desktop/appit/node_modules/express/lib/router/route.js:112:3)\n    at Layer.handle [as handle_request] (/Users/pattharock/Desktop/appit/node_modules/express/lib/router/layer.js:95:5)\n    at /Users/pattharock/Desktop/appit/node_modules/express/lib/router/index.js:281:22\n    at Function.process_params (/Users/pattharock/Desktop/appit/node_modules/express/lib/router/index.js:341:12)\n    at next (/Users/pattharock/Desktop/appit/node_modules/express/lib/router/index.js:275:10)\n    at Function.handle (/Users/pattharock/Desktop/appit/node_modules/express/lib/router/index.js:174:3)"
}
```


### 2e) Get weather data [PROTECTED]

A logged in user may access weather data by making a GET request to `http://{yoururl}/api/weather` with the authorization header set to `Bearer: {token}`

The api will make a call to the OpenWeatherAPI and is teh response is siccessful, it will return the data as ell as update the database. If the request is unsuccessful, it will search the databasse and return the most recent weather record of the logged in user. In case that too is unavailable(no entry in the DB for that user), an error message will be returned. 

The response returned woul look something like

```
{
    "coord": {
        "lon": 114.1577,
        "lat": 22.2855
    },
    "weather": [
        {
            "id": 804,
            "main": "Clouds",
            "description": "overcast clouds",
            "icon": "04n"
        }
    ],
    "base": "stations",
    "main": {
        "temp": 292.53,
        "feels_like": 291.86,
        "temp_min": 291.46,
        "temp_max": 293.29,
        "pressure": 1019,
        "humidity": 51
    },
    "visibility": 10000,
    "wind": {
        "speed": 2.24,
        "deg": 90,
        "gust": 4.92
    },
    "clouds": {
        "all": 100
    },
    "dt": 1639933388,
    "sys": {
        "type": 2,
        "id": 2035800,
        "country": "HK",
        "sunrise": 1639954668,
        "sunset": 1639993434
    },
    "timezone": 28800,
    "id": 1819729,
    "name": "Hong Kong",
    "cod": 200
}
```