const express = require('express');
const http = require('http');
const bodyParser = require('body-parser'); // parses incoming requests as json
const morgan = require('morgan'); // logging framework
const app = express();
const mongoose = require('mongoose');
const router = require('./router');
const cors = require('cors');

// db setup
mongoose.connect('mongodb://localhost:auth/auth'); // second 'auth' is name of db


// app setup (set up express)
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({type: '*/*'}));
router(app);


// server setup (get express to talk to the world)
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log("Server listening on:",port);
