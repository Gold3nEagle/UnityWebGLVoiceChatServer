// imports
var http = require('http');
var https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();
const { PeerServer } = require('peer');

// doing https 
var privateKey = fs.readFileSync('ssl/key.pem');
var certificate = fs.readFileSync('ssl/certificate.pem');

var credentials = { key: privateKey, cert: certificate };

var httpsServer = https.createServer(credentials, app);


// start listening
httpsServer.listen(3000);

// init peer js server
const peerServer = PeerServer({
    port: 3001,
    path: '/',
    ssl: credentials
});


app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});
