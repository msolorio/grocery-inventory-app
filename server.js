const express = require('express');
const morgan = require('morgan');
const app = express();
require('dotenv').config();

const port = process.env.PORT;

app.use('/css', express.static('public/css'));
app.use('/js', express.static('public/js'));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
})

app.listen(port || 3000, () => {
  console.log(`server listening on port: ${port}`);
});
