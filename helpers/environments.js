/*
 * Title: Environments
 * Description: Handle all environment related things
 * Author: Faisal Ahmed
 * Date: 06/07/2023
 *
 */

// Module scaffolding
const environtments = {};

environtments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'fhjaosfhaspofdh',
    maxChecks: 5,
    twilio: {
        fromPhone: '',
    },
};

environtments.production = {
    port: 5000,
    envName: 'production',
    secretKey: '03i04hjaosfhaspofdh',
    maxChecks: 5,
    twilio: {
        fromPhone: '',
    },
};

// detemind which environment has passed
const currentEnvironment =
    typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// export corresponding environment object
const environmentToExports =    typeof environtments[currentEnvironment] === 'object'
        ? environtments[currentEnvironment]
        : environtments.staging;

// exports environment module
module.exports = environmentToExports;
