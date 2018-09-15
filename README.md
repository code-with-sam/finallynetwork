# FinallyNetwork

Finally website platform. Quickly build websites using a Steem blockchain account.

Please see the [Introduction post to learn more about this platform and project]()

# Setup & Install

### Platform

```
git clone
cd platform
touch  .env
```

```
// .env add database details
FNET_DATABASE_USER=user
FNET_DATABASE_PASSWORD=password
```

`npm install` - to download dependencies

`npm start` - run the project on default port 3000

`npm run dev` - to watch for changes in src/ folder

`npm run build` - builds for production

navigate to localhost:3000 in your browser

### Services
During beta users can lock their account to use a specific theme by sending a transfer to @finallynetwork

`/services/beta-script/beta.js`
Connects to the blockchain and databse to check and store users as they unlock their account.

```
git clone
cd services/beta-script/
touch  .env
```

```
// .env add database details
FNET_DATABASE_USER=user
FNET_DATABASE_PASSWORD=password
```
`npm install` - to download dependencies

`node beta.js`

# Contributions

 Contributions are welcome via PR's or as issues.
