/*
 * Title: Utilities
 * Description:  All Utility functions
 * Author: Faisal Ahmed
 * Date: 29/07/2023
 *
 */

// dependencies
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

module.exports = utilities;
