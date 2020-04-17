const express = require('express');
const cors = require('cors');
const config = require('./config');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(cors());
const server = require('http').Server(app);
const io = require('socket.io')(server);
require('./routes')(app);
require('./passport')
server.listen(config.port, () => {
	console.log(`TAKAMALI server running on port ${config.port}`)
});
var mongoDB = 'mongodb://127.0.0.1/takamali';
//var mongoDB = 'mongodb+srv://tom:kicc@2019!!@cluster0-odnlj.mongodb.net/takamali?retryWrites=true&w=majority'
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

io.on('connection', (socket) => {
	console.log('connected')
});


