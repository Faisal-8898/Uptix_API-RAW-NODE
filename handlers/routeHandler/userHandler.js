/* eslint-disable no-underscore-dangle */
/*
 * Title: User Handler
 * Description: Handler route for handle user related routes
 * Author: Faisal Ahmed
 * Date: 29/07/2023
 *
 */

// MODULE SCAFFOLDING
const handler = {};

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethod = ['get', 'put', 'post', 'delete'];
    if (acceptedMethod.indexOf(requestProperties.method) > -1) {
        handler._users[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }

    callback(200, {
        msg: 'this is a user url',
    });
};

// New scaffolding for users
handler._users = {};

handler._users.post = (requestProperties, callback) => {
    const firstName =        typeof requestProperties.body.firstName === 'string' &&
        requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : false;
    const lastName =        typeof requestProperties.body.lastName === 'string' &&
        requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : false;
            const password =        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.password
            : false;
            const phone =        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.lastName.trim().length == '11'
            ? requestProperties.body.password
            : false;
            const tosAgreemnt =        typeof requestProperties.body.tosAgreemnt === 'boolean'
            ? requestProperties.body.tosAgreemnt
            : false;

            if(firstName&&lastName&&password&&phone&&tosAgreemnt){
                
            }
            else{
                callback(400);
            }
};

handler._users.get = (requestProperties, callback) => {};

handler._users.put = (requestProperties, callback) => {};

handler._users.delete = (requestProperties, callback) => {};

module.exports = handler;
