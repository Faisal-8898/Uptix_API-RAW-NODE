/*
 * Title: Routes
 * Description: Application Routes
 * Author: Faisal Ahmed
 * Date: 27/06/2023
 *
 */

// dependencies

const { sampleHandler } = require('./handlers/routeHandler/sampleHandler');
const { userHandler } = require('./handlers/routeHandler/userHandler');
const { tokenHandler } = require('./handlers/routeHandler/tokenHandler');

const routes = {
    sample: sampleHandler,
    user: userHandler,
    token: tokenHandler,
};

module.exports = routes;
