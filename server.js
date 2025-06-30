require('./config/db');

const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser').json;
const userRoutes = require('./api/user');
const cors = require('cors');
app.use(bodyParser());
app.use(cors());

app.use('/user', userRoutes);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});