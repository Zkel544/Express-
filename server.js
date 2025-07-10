require('./config/db');
require('dotenv').config();

const express    = require('express');
const app        = express();
const port       = process.env.PORT || 3000;
const bodyParser = require('body-parser').json;
const cors       = require('cors');

app.use(bodyParser());
app.use(cors());

const routes = require('./routes');
app.use('/', routes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});