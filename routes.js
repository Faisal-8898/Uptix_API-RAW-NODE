/*
 * Title: Routes
 * Description: Application Routes
 * Author: Faisal Ahmed
 * Date: 27/06/2023
 *
 */

// dependencies

const { sampleHandler } = require('./handlers/routeHandler/sampleHandler');

const routes = {
    sample: sampleHandler,
};

module.exports = routes;
