/*
 * Title: Utilities
 * Description:  All Utility functions
 * Author: Faisal Ahmed
 * Date: 29/07/2023
 *
 */

// dependencies
const crypto = require('crypto');
const environments = require('./environments');

//  MODULAR SCAFFOLDING
const utilities = {};
utilities.parseJson = (jsonString) => {
    let output;
    try {
        output = JSON.parse(jsonString);
    } catch {
        output = {};
    }
    return output;
};

utilities.hash = (str) => {
    if (typeof str === 'string' && str.length > 0) {
        const hash = crypto.createHmac('sha256', environments.secretKey).update(str).digest('hex');
        return hash;
    }
    return false;
};

utilities.createRandomString = (strlen) => {
    const length = strlen;
    const possibleChar = 'qwertyuiopoasdfhlkhjsdgdfzxcvbnm12334534565677890';
    let output = '';
    for (let i = 1; i <= length; i += 1) {
        const randomChar = possibleChar.charAt(Math.floor(Math.random() * possibleChar.length));
        output += randomChar;
    }

    return output;
};

module.exports = utilities;
