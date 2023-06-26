/*
 * Title: Uptix an Uptime Monitoring Application
 * Description: A RESTFul API to monitor up or down time of user defined links
 * Author: Faisal Ahmed
 * Date: 26/06/2023
 *
 */

// dependencies
const http = require('http');

// app object - module scaffolding
const app = {};

// configaration
app.config = {
    port: 3000,
};

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log('hello I am server');
    });
};

// handle req res
app.handleReqRes = (req, res) => {
    res.end('hello i am res');
};

// start the server
app.createServer();
