/* eslint-disable no-underscore-dangle */
/*
 * Title: User Handler
 * Description: Handler route for handle user related routes
 * Author: Faisal Ahmed
 * Date: 29/07/2023
 *
 */

// dependencies
const data = require('../../lib/data');
const { hash, parseJson } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');

// MODULE SCAFFOLDING
const handler = {};

// New scaffolding for users
handler.check = {};

handler.checkHandler = (requestProperties, callback) => {
    const acceptedMethod = ['get', 'put', 'post', 'delete'];
    if (acceptedMethod.includes(requestProperties.method)) {
        handler.check[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler.check.post = (requestProperties, callback) => {
    const { body } = requestProperties;

    const protocol =
        typeof body.protocol === 'string' && ['http', 'https'].indexOf(body.protocol) > -1
            ? body.protocol
            : false;

    const url = typeof body.url === 'string' && body.url.trim().length > 0 ? body.url : false;

    const method =
        typeof body.method === 'string'
        && ['get', 'post', 'put', 'delete'].indexOf(body.method) > -1
            ? body.method
            : false;

    const successCodes =
        typeof body.successCodes === 'object' && body.successCodes instanceof Array
            ? body.successCodes
            : false;

    const timeoutSeconds =
        typeof body.timeoutSeconds === 'number'
        && body.timeoutSeconds % 1 === 0
        && body.timeoutSeconds >= 1
        && body.timeoutSeconds <= 5
            ? body.timeoutSeconds
            : false;

    if (protocol && url && method && successCodes && timeoutSeconds) {
        const { headers } = requestProperties;
    } else {
        callback(400, {
            error: 'You have a problem in your request',
        });
    }
};

handler.check.get = (requestProperties, callback) => {};

handler.check.put = (requestProperties, callback) => {};

handler.check.delete = (requestProperties, callback) => {};

module.exports = handler;
