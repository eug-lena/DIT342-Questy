# Local Deployment

These steps describe how you can deploy your app locally in production mode if you do not want to deploy your app online for free (see [Deployment](./DEPLOYMENT.md)).

## Requirements

* [MongoDB](https://www.mongodb.com/download-center/community?jmp=nav) must be running locally on port 27017

## Deploy Locally

> Make sure you have all dependencies installed for the server and client (using `npm install`).

1. Change into the root directory `cd group-27-web`
2. Set the environment variable `NODE_ENV` for the server:
    * macOS/Linux: `export NODE_ENV=production` (check with `echo $NODE_ENV`)
    * Windows: `set NODE_ENV "production"` (check with `echo %NODE_ENV%`)
3. Set the environment variable `MONGODB_URI` for the server:
    * macOS/Linux: `export MONGODB_URI=mongodb://127.0.0.1:27017/gameReviewDB`
    * Windows: `set MONGODB_URI "mongodb://127.0.0.1:27017/gameReviewDB"`
4. Set the environment variable `VUE_APP_API_ENDPOINT` for the client production build:
    * macOS/Linux: `export VUE_APP_API_ENDPOINT=http://127.0.0.1:3000/api`
    * Windows: `set VUE_APP_API_ENDPOINT "http://127.0.0.1:3000/api"`
5. Build the minified Vue.js production assets via `npm run build --prefix client`
6. Run the application with `npm run start --prefix server`

```none
➜  group-27-web git:(master) ✗ npm run start --prefix server
3:03:38 PM web.1 |  Express server listening on port 3000, in production mode
3:03:38 PM web.1 |  Backend: http://127.0.0.1:3000/api/
3:03:38 PM web.1 |  Frontend (production): http://127.0.0.1:3000/
3:03:38 PM web.1 |  Connected to MongoDB with URI: mongodb://127.0.0.1:27017/game-review
```
