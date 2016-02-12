# gc-linkedin

participatory professional network visualisation through linkedin and graph commons.

#### build and run
- Create a LinkedIn application and obtain the sAPI and secret keys
- Get an API key on your Graph Commons profile edit page
- Create a graph on Graph Commons, and publish it so that it will be available
as an embedded graph.
- download dependencies
```
npm install
```
- create db folder for the sqlite database
```
mkdir db
```
- start the program
```
LINKEDIN_REDIRECT_URI=<linkedin-redirect-uri> \
LINKEDIN_API_KEY=<linkedin-api-key> \
LINKEDIN_SECRET_KEY=<linkedin-secret-key> \
GC_GRAPH_ID=<graph-id> \
GC_API_KEY=<graphcommons-api-key> \
node app.js
```

#### Quick Deploy [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/artsince/gc-linkedin)
This will deploy this app on [Heroku](https://heroku.com) to demo it right away.
