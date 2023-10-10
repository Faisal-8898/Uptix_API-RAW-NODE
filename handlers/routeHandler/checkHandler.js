/*
 * Title: Check Handler
 * Description: Handles all checks that client have or need to update
 * Author: Faisal Ahmed
 * Date: 10/10/2023
 *
 */

// dependencies
const data = require('../../lib/data');
const { maxChecks } = require('../../helpers/environments');
const { createRandomString, parseJson } = require('../../helpers/utilities');
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

    const protocol =        typeof body.protocol === 'string' && ['http', 'https'].indexOf(body.protocol) > -1
            ? body.protocol
            : false;

    const url = typeof body.url === 'string' && body.url.trim().length > 0 ? body.url : false;

    const method =        typeof body.method === 'string' && ['GET', 'POST', 'PUT', 'DELETE'].indexOf(body.method) > -1
            ? body.method
            : false;

    const successCodes =        typeof body.successCodes === 'object' && body.successCodes instanceof Array
            ? body.successCodes
            : false;

            const timeoutSeconds = typeof body.timeoutSeconds === 'number'&& body.timeoutSeconds % 1 === 0 && body.timeoutSeconds >= 1 && body.timeoutSeconds <= 5
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
                                const uchek = userObj.checks;
                                const userChecks =                                    typeof uchek === 'object' && uchek instanceof Array
                                        ? uchek
                                        : [];
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

                                            // save the modified new user data
                                            data.update('users', userPhone, userObj, (err4) => {
                                                if (!err4) {
                                                    callback(200, checkObj);
                                                } else {
                                                    callback(500, {
                                                        error: 'there is a problem in server side',
                                                    });
                                                }
                                            });
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
                    error: 'Authenticaton problem token not found!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'Some field is empty',
        });
    }
};

handler.check.get = (requestProperties, callback) => {
    const qobj = requestProperties.queryStringObj;
    const id = typeof qobj.id === 'string' && qobj.id.trim().length > 0 ? qobj.id : false;

    if (id) {
        data.read('checks', id, (err, checkData) => {
            if (!err && checkData) {
                const { headers } = requestProperties;
                const token = typeof headers.token === 'string' ? headers.token : false;

                tokenHandler.token.verify(token, parseJson(checkData).userPhone, (tokenIsvalid) => {
                    if (tokenIsvalid) {
                        callback(200, parseJson(checkData));
                    } else {
                        callback(403, {
                            error: 'Authenticaton problem token not found!',
                        });
                    }
                });
            } else {
                callback(500, {
                    error: 'Server side problem',
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem in your request',
        });
    }
};

handler.check.put = (requestProperties, callback) => {
    const { body } = requestProperties;
    const id = typeof body.id === 'string' && body.id.trim().length > 0 ? body.id : false;

    const protocol =        typeof body.protocol === 'string' && ['http', 'https'].indexOf(body.protocol) > -1
            ? body.protocol
            : false;

    const url = typeof body.url === 'string' && body.url.trim().length > 0 ? body.url : false;

    const method =        typeof body.method === 'string' && [('GET', 'POST', 'PUT', 'DELETE')].indexOf(body.method) > -1
            ? body.method
            : false;

    const successCodes =        typeof body.successCodes === 'object' && body.successCodes instanceof Array
            ? body.successCodes
            : false;

    const timeoutSeconds = typeof body.timeoutSeconds === 'number'&& body.timeoutSeconds % 1 === 0 && body.timeoutSeconds >= 1 && body.timeoutSeconds <= 5
        ? body.timeoutSeconds
        : false;
    if (id) {
        if (protocol || url || method || successCodes || timeoutSeconds) {
            data.read('checks', id, (err1, checkData) => {
                if (!err1 && checkData) {
                    const checkObj = parseJson(checkData);
                    const { headers } = requestProperties;
                    const token = typeof headers.token === 'string' ? headers.token : false;

                    tokenHandler.token.verify(token, checkObj.userPhone, (tokenIsvalid) => {
                        if (tokenIsvalid) {
                            if (protocol) {
                                checkObj.protocol = protocol;
                            }
                            if (url) {
                                checkObj.url = url;
                            }
                            if (method) {
                                checkObj.method = method;
                            }
                            if (successCodes) {
                                checkObj.successCodes = successCodes;
                            }
                            if (timeoutSeconds) {
                                checkObj.timeoutSeconds = timeoutSeconds;
                            } else {
                                // update the store object
                                data.update('checks', id, checkObj, (err3) => {
                                    if (!err3) {
                                        callback(200);
                                    } else {
                                        callback(500, {
                                            error: 'there is a server side problem!',
                                        });
                                    }
                                });
                            }
                        } else {
                            callback(403, {
                                error: 'Authenticaton problem token not found!',
                            });
                        }
                    });
                    callback(500, {
                        error: 'there is a server side problem!',
                    });
                }
            });
        } else {
            callback(405, {
                error: 'Atleast one field need to update!',
            });
        }
    } else {
        callback(400, {
            error: 'You have problem in your req!',
        });
    }
};

handler.check.delete = (requestProperties, callback) => {
    const qobj = requestProperties.queryStringObj;
    const id = typeof qobj.id === 'string' && qobj.id.trim().length > 0 ? qobj.id : false;

    if (id) {
        data.read('checks', id, (err, checkData) => {
            if (!err && checkData) {
                const { headers } = requestProperties;
                const token = typeof headers.token === 'string' ? headers.token : false;

                tokenHandler.token.verify(token, parseJson(checkData).userPhone, (tokenIsvalid) => {
                    if (tokenIsvalid) {
                        data.delete('checks', id, (err2) => {
                            if (!err2) {
                                data.read(
                                    'users',
                                    parseJson(checkData).userPhone,
                                    (err3, userdata) => {
                                        const userObj = parseJson(userdata);
                                        if (!err3 && userdata) {
                                            const uchek = userObj.checks;
                                            const userChecks =                                                typeof uchek === 'object' && uchek instanceof Array
                                                    ? uchek
                                                    : [];

                                            const checkPosition = userChecks.indexOf(id);
                                            if (checkPosition > -1) {
                                                userChecks.splice(checkPosition, 1);

                                                userObj.checks = userChecks;
                                                data.update(
                                                    'users',
                                                    userObj.phone,
                                                    userObj,
                                                    (err4) => {
                                                        if (!err4) {
                                                            callback(200);
                                                        } else {
                                                            callback(500, {
                                                                error: 'there is a server side problem!',
                                                            });
                                                        }
                                                    },
                                                );
                                            } else {
                                                callback(500, {
                                                    error: 'there is a server side problem!',
                                                });
                                            }
                                        } else {
                                            callback(500, {
                                                error: 'Server side problem',
                                            });
                                        }
                                    },
                                );
                            } else {
                                callback(500, {
                                    error: 'Server side problem',
                                });
                            }
                        });
                    } else {
                        callback(403, {
                            error: 'Authenticaton problem token not found!',
                        });
                    }
                });
            } else {
                callback(500, {
                    error: 'Server side problem',
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem in your request',
        });
    }
};

module.exports = handler;
