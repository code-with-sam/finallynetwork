const mongoose = require('mongoose');
const steem = require('steem');
const env = require('dotenv').config()

const mongoDB = `mongodb://${process.env.FNET_DATABASE_USER}:${process.env.FNET_DATABASE_PASSWORD}@ds155352.mlab.com:55352/fnet`;
const {createServer} = require('http').createServer().listen(4000)
const User = require('./models/user')


mongoose.connect(mongoDB).then(
 () => console.log('CONNECTED TO DATABASE'),
 err => console.log('ERROR CONNECTING TO DATABASE', err)
);

mongoose.Promise = global.Promise;
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));


async function updateDatabase()  {
  getAccountTransactions('finallynetwork')
}

async function getAccountTransactions(username) {
  steem.api.getAccountHistory(username, -1, 100, (err, result) =>  {
    if (err) throw err
    console.log(result.length)

    result.forEach((tx, i) => {
      if(tx[1].op[0] === 'transfer') {
          console.log('TRANSFER: ', tx[1].op[1].from)
          let transferFrom = tx[1].op[1].from

          User.findOneAndUpdate({user: transferFrom}, { beta: true , user: transferFrom }, {upsert: true}, (result) => {
            console.log(result)
          });

      }
    })
  })
}

setInterval(updateDatabase, 5000)
