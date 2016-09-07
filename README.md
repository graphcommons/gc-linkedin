# gc-linkedin

participatory professional network visualisation through linkedin and graph commons.

#### build and run
- Create a LinkedIn application and obtain the API and secret keys
- Get an API key on your Graph Commons profile edit page
- Create a graph on Graph Commons, and publish it so that it will be available
as an embedded graph.
- download dependencies
```
npm install
```
- Prepare a postgres database and keep the url. In order to start a db instance with Docker;
```
docker run \
  --name gc_linkedin_postgres \
  --publish=5432:5432 \
  -e POSTGRES_PASSWORD=123456 \
  -e POSTGRES_USER=graphcommons \
  -d postgres:9.5.0
```
The database in the container can be reached at `postgres://graphcommons:123456@localhost:5432/postgres`

- build the css files, if necessary
```
gulp sass
```

- start the program
```
DATABASE_URL=postgres://graphcommons:123456@localhost:5432/postgres \
APP_URL=http://localhost:3000 \
PORT=3000 \
LINKEDIN_API_KEY=<linkedin-api-key> \
LINKEDIN_SECRET_KEY=<linkedin-secret-key> \
GC_GRAPH_ID=<graph-id> \
GC_API_KEY=<graphcommons-api-key> \
node app.js
```
`APP_URL` is necessary for the authentication callback from LinkedIn. The authentication callback URL should be
set as `http://localhost:3000/auth/callback`

#### Quick Deploy [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/ahmetkizilay/gc-linkedin)
This will deploy this app on [Heroku](https://heroku.com) to demo it right away. By default, a web dyno will be started with free heroku postgres database add on. Required environment variables will be listed on the installation page for you to fill out.
