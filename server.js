require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();
const userRouter = require('./routes/usersRoute');

mongoose.Promise = global.Promise;

app.use('/css', express.static('public/css'));
app.use('/js', express.static('public/js'));
app.use('/images', express.static('public/images'));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/inventory.html`);
});

app.use('/users', userRouter);

// userRouter.js
// app.use('/items/:item_id', itemsRouter);

app.get('*', (req, res) => {
  res.status(404).json({message: 'resource not found'});
});

let server;

function runServer(databaseUrl, port) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, (err) => {
      if (err) {
        return reject(err);
      }
    });
    server = app.listen(port, () => {
      console.log(`server listening on port: ${port}`);
      return resolve();
    })
    .on('error', (err) => {
      mongoose.disconnect();
      reject(err);
    });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log(`Closing server`);
    server.close((err) => {
      if (err) return reject(err);

      resolve();
    });
  });
}

// if file is run directly by calling node server js
// we call runServer
if (require.main === module) {
  runServer(process.env.DATABASE_URL, process.env.PORT).catch((err) => {
    console.error('error:', err);
  });
}

module.exports = { app, runServer, closeServer };
