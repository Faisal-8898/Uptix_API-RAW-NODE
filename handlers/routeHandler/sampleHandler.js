/*
 * Title: Sample Handler
 * Description: Sample Handler
 * Author: Faisal Ahmed
 * Date: 27/06/2023
 *
 */

// MODULE SCAFFOLDING
const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
    console.log(requestProperties);

    callback(200, {
        msg: 'this is a sample url',
    });
};

module.exports = handler;
