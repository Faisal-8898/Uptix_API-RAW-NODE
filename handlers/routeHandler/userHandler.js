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

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethod = ['get', 'put', 'post', 'delete'];
    if (acceptedMethod.includes(requestProperties.method)) {
        handler.check[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler.check.post = (requestProperties, callback) => {
    const { body } = requestProperties;

    const firstName =        typeof body.firstName === 'string' && body.firstName.trim().length > 0
            ? body.firstName
            : false;

    const lastName =        typeof body.lastName === 'string' && body.lastName.trim().length > 0
            ? body.lastName
            : false;

    const password =        typeof body.password === 'string' && body.password.trim().length > 0
            ? body.password
            : false;

    const phone =
        typeof body.phone === 'string' && body.phone.trim().length === 11 ? body.phone : false;

    const tosAgreement = typeof body.tosAgreement === 'boolean' ? body.tosAgreement : false;

    if (firstName && lastName && password && phone && tosAgreement) {
        data.read('users', phone, (err, user) => {
            if (err) {
                const userObj = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement,
                };

                data.create('users', phone, userObj, (err1) => {
                    if (!err1) {
                        callback(200, {
                            message: 'user created Succesfully!',
                        });
                    } else {
                        callback(500, {
                            error: 'could not create user!',
                        });
                    }
                });
            } else {
                callback(500, {
                    error: 'Already have that user!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'Some fields remain empty!',
        });
    }
};

handler.check.get = (requestProperties, callback) => {
    const qurObj = requestProperties.queryStringObj;
    const { headers } = requestProperties;
    const phone =
        typeof qurObj.phone === 'string' && qurObj.phone.trim().length === 11
            ? qurObj.phone
            : false;

    if (phone) {
        tokenHandler.token.verify(headers.token, phone, (tokenId) => {
            if (tokenId) {
                data.read('users', phone, (err, hellouser) => {
                    const user = { ...parseJson(hellouser) };

                    if (!err && user) {
                        delete user.password;
                        callback(200, user);
                    } else {
                        callback(404, {
                            error: 'user not found!',
                        });
                    }
                });
            } else {
                callback(405, {
                    error: 'Authentication failed',
                });
            }
        });
    } else {
        callback(404, {
            error: 'user not found!',
        });
    }
};

handler.check.put = (requestProperties, callback) => {
    const { body } = requestProperties;
    const { headers } = requestProperties;

    const firstName =        typeof body.firstName === 'string' && body.firstName.trim().length > 0
            ? body.firstName
            : false;

    const lastName =        typeof body.lastName === 'string' && body.lastName.trim().length > 0
            ? body.lastName
            : false;

    const password =        typeof body.password === 'string' && body.password.trim().length > 0
            ? body.password
            : false;

    const phone =
        typeof body.phone === 'string' && body.phone.trim().length === 11 ? body.phone : false;

    if (phone) {
        if (firstName || lastName || password) {
            tokenHandler.token.verify(headers.token, phone, (tokenId) => {
                if (tokenId) {
                    data.read('users', phone, (err, uData) => {
                        const userData = { ...parseJson(uData) };

                        if (!err && userData) {
                            if (firstName) {
                                userData.firstName = firstName;
                            }

                            if (lastName) {
                                userData.lastName = lastName;
                            }

                            if (password) {
                                userData.password = hash(password);
                            }

                            data.update('users', phone, userData, (err1) => {
                                if (!err1) {
                                    callback(200, {
                                        message: 'update done!',
                                    });
                                } else {
                                    callback(500, {
                                        error: 'There is a problem in server side',
                                    });
                                }
                            });
                        } else {
                            callback(400, {
                                error: 'Invalid request, Please try again!',
                            });
                        }
                    });
                } else {
                    callback(405, {
                        error: 'Authentication failed',
                    });
                }
            });
        } else {
            callback(400, {
                error: 'Invalid request, Please try again!',
            });
        }
    } else {
        callback(400, {
            error: 'Invalid phone number, Please try again!',
        });
    }
};

handler.check.delete = (requestProperties, callback) => {
    const qurObj = requestProperties.queryStringObj;
    const { headers } = requestProperties;
    const phone =
        typeof qurObj.phone === 'string' && qurObj.phone.trim().length === 11
            ? qurObj.phone
            : false;

    if (phone) {
        // look for user
        tokenHandler.token.verify(headers.token, phone, (tokenId) => {
            if (tokenId) {
                data.read('users', phone, (err, hellouser) => {
                    const user = { ...parseJson(hellouser) };

                    if (!err && user) {
                        data.delete('users', phone, (err2) => {
                            if (err2) {
                                callback(500, {
                                    error: 'server side problem',
                                });
                            } else {
                                callback(200, {
                                    error: 'Deleted succesfully',
                                });
                            }
                        });
                    } else {
                        callback(404, {
                            error: 'user not found!',
                        });
                    }
                });
            } else {
                callback(405, {
                    error: 'Authentication failed',
                });
            }
        });
    } else {
        callback(404, {
            error: 'user not found!',
        });
    }
};

module.exports = handler;
