/*
 * Title: Handler for request and response
 * Description: req and res handle
 * Author: Faisal Ahmed
 * Date: 27/06/2023
 *
 */

// dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const { notFoundHandler } = require('../handlers/routeHandler/notFoundHandler');

// module scaffolding
const handler = {};
handler.handleReqRes = (req, res) => {
    try {
        // get the req and parse it
        const parrsedUrl = url.parse(req.url, true);
        const path = parrsedUrl.pathname;
        const trimmedPath = path.replace(/^\/+|\/+$/g, '');
        const method = req.method.toLowerCase();
        const queryStringObj = parrsedUrl.query;
        const { headers } = req;

        const decoder = new StringDecoder('utf-8');

        const requestProperties = {
            parrsedUrl,
            path,
            trimmedPath,
            method,
            queryStringObj,
            headers,
        };

        // eslint-disable-next-line no-unused-vars
        let realData = '';

        const choosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;

        choosenHandler(requestProperties, (statusCode, payload) => {
            let statusCode1 = statusCode;
            let payload1 = payload;
            statusCode1 = typeof statusCode === 'number' ? statusCode : 500;
            payload1 = typeof payload === 'object' ? payload : {};

            const payloadString = JSON.stringify(payload);

            res.writeHead(statusCode);
            res.end(payloadString);
        });

        req.on('data', (buffer) => {
            realData += decoder.write(buffer);
        });

        req.on('end', () => {
            realData += decoder.end();
            console.log(realData);
            res.end('hello i am res');
        });
    } catch (error) {
        console.error(error);
    }
};

module.exports = handler;
