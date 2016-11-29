# js-executor-service (client)

## Building & running
In order to build entire env (both client and server) you have to use docker-compose.
* Open DockerCLI
* Go to project's main folder
* Run
  `docker-compose build`
* Run
  `docker-compose up`

***Server will be available under http://192.168.99.100:8080***

***Client will be available under http://192.168.99.100:3000***

</br>
## Structure of provided *.js file
Client accepts \*.js files with ***ONE*** function.
It parses that file and asks you to provide all your function's arguments.

### Warning 
All arguments are passed as strings.
