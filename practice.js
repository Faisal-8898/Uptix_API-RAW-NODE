// dependecies
const http = require('http');

// app - object module scaffolding
const app = {};

// config
app.config = {
    port: 3000,
};

// Creating a server
app.createServer = () => {
    const server = http.createServer(app.handleReq);
    server.listen(app.config.port, () => {
        console.log('hello i am server');
    });
};

// creating handle req res funtion
app.handleReq = (req, res) => {
    res.end('hello brother');
};

app.createServer();
