/*
 * Title: Uptix an Uptime Monitoring Application
 * Description: A RESTFul API to monitor up or down time of user defined links
 * Author: Faisal Ahmed
 * Date: 26/06/2023
 *
 */

// dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');
const data = require('./lib/data');

// app object - module scaffolding
const app = {};

// data.delete('test', 'newFile', (err) => {
//     console.log(err);
// });

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`hello i am server listening at ${environment.port}`);
    });
};


// handle req res
app.handleReqRes = handleReqRes;

// start the server
app.createServer();
