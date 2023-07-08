// dependencies
const fs = require('fs');
const path = require('path');

// module scaffolding
const lib = {};

// BASE DIRECTORY OF DATA FOLDER
lib.baseDir = path.join(__dirname, '/../.data/');

// write data to file
lib.create = (dir, file, data, callback) => {
    fs.open(`${lib.baseDir + dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // convert data to string
            const stringData = JSON.stringify(data);

            // Write data and then close it
            fs.writeFile(fileDescriptor, stringData, (err) => {
                if (!err) {
                    fs.close(fileDescriptor, (err) => {
                        if (!err) {
                            callback(false);
                        } else {
                            callback("sorry can't delete the file");
                        }
                    });
                } else {
                    callback("Couldn't write to the new file");
                }
            });
        } else {
            callback('create file got error so we are seeing this');
        }
    });
};

module.exports = lib;
