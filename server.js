'use strict';

//////////////////////////////////////////////////
// SETUP
//////////////////////////////////////////////////
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const morgan = require('morgan');

const passport = require('passport');
const flash = require('connect-flash');


//////////////////////////////////////////////////
// CONFIGURATION
//////////////////////////////////////////////////
mongoose.Promise = global.Promise;

require('./config/passport')(passport);

app.use(morgan('common'));
app.use(cookieParser());
app.use(bodyParser());

app.use('/users', express.static('public'));

app.set('view engine', 'ejs');

// PASSPORT
app.use(session({secret: process.env.SESSION_SECRET}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes')(app, passport);

// for runServer and closeServer
let server;

function runServer(databaseUrl, port) {
  return new Promise((resolve, reject) => {
    try {
      mongoose.connect(databaseUrl);
    }
    catch(err) {
      mongoose.createConnection(databaseUrl);
    }
    // mongoose.connect(databaseUrl, (err) => {
    //   if (err) return reject(err);
    // });
    server = app.listen(port, () => {
      console.log(`your server running on port: ${port}\n...you better go and catch it.`);
      return resolve();
    })
    .on('error', (err) => {
      mongoose.disconnect();
      return reject(err);
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log(`closing server`);
      server.close((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  });
}

// if file is run directly, run server
if (require.main === module) {
  runServer(process.env.DATABASE_URL, process.env.PORT).catch((err) => {
    console.error('error:', err);
  });
}

// available for tests
module.exports = { app, runServer, closeServer };
