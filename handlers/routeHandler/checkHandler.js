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
const { maxChecks } = require('../../helpers/environments');
const { createRandomString, parseJson, tokenHandler } = require('../../helpers/utilities');

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
        const token = typeof headers.token === 'string' ? headers.token : false;

        // lookup the user phone number using the token
        data.read('tokens', token, (err1, tokenData) => {
            if (!err1 && tokenData) {
                const userPhone = parseJson(tokenData).phone;

                data.read('users', userPhone, (err2, userData) => {
                    if (!err2 && userData) {
                        tokenHandler.token.verify(token, userPhone, (tokenIsvalid) => {
                            if (tokenIsvalid) {
                                const userObj = parseJson(userData);
                                const userChecks = typeof userObj.checks === 'object' &&
                                userObj.checks instanceof Array ? userObj.checks : [];
                                if (userChecks.length < maxChecks) {
                                    const checkId = createRandomString(20);
                                    const checkObj = {
                                        id: checkId,
                                        userPhone,
                                        protocol,
                                        url,
                                        method,
                                        successCodes,
                                        timeoutSeconds,
                                    };

                                    data.create('checks', checkId, checkObj, (err3) => {
                                        if (!err3) {
                                            userObj.checks = userChecks;
                                            userObj.checks.push(checkId);

                                            //save the modified new user data
                                            data.update
                                        } else {
                                            callback(500, {
                                                error: 'There is a problem in server side',
                                            });
                                        }
                                    });
                                } else {
                                    callback(403, {
                                        error: 'User has already reached max check limit!',
                                    });
                                }
                            } else {
                                callback(403, {
                                    error: 'Authentication problem',
                                });
                            }
                        });
                    } else {
                        callback(403, {
                            error: 'Authenticaton problem',
                        });
                    }
                });
            } else {
                callback(403, {
                    error: 'Authenticaton problem',
                });
            }
        });
    } else {
        callback(400, {
            error: 'Some field is empty',
        });
    }
};

handler.check.get = (requestProperties, callback) => {};

handler.check.put = (requestProperties, callback) => {};

handler.check.delete = (requestProperties, callback) => {};

module.exports = handler;
