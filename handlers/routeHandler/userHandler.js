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
// MODULE SCAFFOLDING
const handler = {};

// New scaffolding for users
handler._users = {};

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethod = ['get', 'put', 'post', 'delete'];
    if (acceptedMethod.includes(requestProperties.method)) {
        handler._users[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler._users.post = (requestProperties, callback) => {
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
                    error: 'there was a problem in server site',
                });
            }
        });
    } else {
        callback(400, {
            error: 'Some fields remain empty!',
        });
    }
};

handler._users.get = (requestProperties, callback) => {
    const phone = typeof requestProperties.queryStringObj.phone === 'string' && 
    requestProperties.queryStringObj.phone.trim().length === 11 ? requestProperties.queryStringObj.phone : false;

    if (phone) {
        // look for user
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
        callback(404, {
            error: 'user not found!',
        });
    }
};

handler._users.put = (requestProperties, callback) => {};

handler._users.delete = (requestProperties, callback) => {};

module.exports = handler;
