/*
 * Title: Sample Handler
 * Description: Sample Handler
 * Author: Faisal Ahmed
 * Date: 27/06/2023
 *
 */

// MODULE SCAFFOLDING
const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
    callback(404, {
        messege: 'Your requsted URL not found!',
    });
};

module.exports = handler;
