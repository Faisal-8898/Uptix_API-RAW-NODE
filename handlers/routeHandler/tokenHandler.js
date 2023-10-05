/*
 * Title: token handler
 * Description: Handle all type of incoming request of token
 * Author: Faisal Ahmed
 * Date: 05/10/2023
 *
 */

// dependencies
const data = require('../../lib/data');
const { hash, parseJson, createRandomString } = require('../../helpers/utilities');

// MODULE SCAFFOLDING
const handler = {};

// New scaffolding for token
handler.token = {};

handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethod = ['get', 'put', 'post', 'delete'];
    if (acceptedMethod.includes(requestProperties.method)) {
        handler.token[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};
handler.token.post = (requestProperties, callback) => {
    const { body } = requestProperties;
    const phone =        typeof body.phone === 'string' && body.phone.trim().length === 11 ? body.phone : false;

    const password =        typeof body.password === 'string' && body.password.trim().length > 0
            ? body.password
            : false;

    if (phone && password) {
        data.read('users', phone, (err, userData) => {
            const hashPassword = hash(password);
            if (hashPassword === parseJson(userData).password) {
                const tokenId = createRandomString(hashPassword.length);
                const expires = Date.now() + 60 * 60 * 1000;
                const tokenObj = {
                    phone,
                    id: tokenId,
                    expires,
                };

                data.create('tokens', tokenId, tokenObj, (error) => {
                    if (!error) {
                        callback(200, tokenObj);
                    } else {
                        callback(500, {
                            error: 'there is a problem in servers side',
                        });
                    }
                });
            } else {
                callback(400, {
                    error: 'Invalid password!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'Some fields remain empty!',
        });
    }
};

handler.token.get = (requestProperties, callback) => {
    const qobj = requestProperties.queryStringObj;

    const tokenId = typeof qobj.id === 'string' && qobj.id.length > 0 ? qobj.id : false;
    if (tokenId) {
        data.read('tokens', tokenId, (err, tData) => {
            const tokenData = { ...parseJson(tData) };
            if (!err) {
                callback(200, tokenData);
            } else {
                callback(404, {
                    error: 'Requested token not found',
                });
            }
        });
    } else {
        callback(404, {
            error: 'token not found',
        });
    }
};

handler.token.put = (requestProperties, callback) => {
    const qobj = requestProperties.queryStringObj;
    const { body } = requestProperties;

    const tokenId = typeof qobj.id === 'string' && qobj.id.length > 0 ? qobj.id : false;
    const extend = typeof body.extend === 'boolean' ? body.extend : false;

    if (tokenId && extend) {
        data.read('tokens', tokenId, (error, datum) => {
            const tokenObj = parseJson(datum);
            console.log(tokenObj);
            if (tokenObj.expires > Date.now()) {
                tokenObj.expires = Date.now() + 60 * 60 * 1000;
                data.update('tokens', tokenId, tokenObj, (err2) => {
                    if (!err2) {
                        callback(200);
                    } else {
                        callback(500, {
                            error: 'there is a server side error',
                        });
                    }
                });
            } else {
                callback(500, {
                    error: 'Token already expired!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'invalid reqeust!',
        });
    }
};

handler.token.delete = (requestProperties, callback) => {
    const qobj = requestProperties.queryStringObj;
    const tokenId = typeof qobj.id === 'string' && qobj.id.length > 0 ? qobj.id : false;

    if (tokenId) {
        data.read('tokens', tokenId, (error, datum) => {
            const tokenObj = parseJson(datum);
            console.log(tokenObj);
            if (!error && tokenObj) {
                data.delete('tokens', tokenId, (err2) => {
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
                    error: 'token not found!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'invalid reqeust!',
        });
    }
};

module.exports = handler;
