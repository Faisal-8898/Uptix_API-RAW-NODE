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
const { parseJson } = require('./utilities');

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

        req.on('data', (buffer) => {
            realData += decoder.write(buffer);
        });

        req.on('end', () => {
            realData += decoder.end();
            requestProperties.body = parseJson(realData);
            choosenHandler(requestProperties, (statusCode, payload) => {
                const statusCode1 = typeof statusCode === 'number' ? statusCode : 500;
                const payload1 = typeof payload === 'object' ? payload : {};

                const payloadString = JSON.stringify(payload1);
                res.setHeader('Content-Type', 'application/json');
                res.writeHead(statusCode1);
                res.end(payloadString);
            });
        });
    } catch (error) {
        console.error(error);
    }
};

module.exports = handler;
