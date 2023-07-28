// dependencies
const { error } = require('console');
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
            fs.writeFile(fileDescriptor, stringData, (err2) => {
                if (!err2) {
                    fs.close(fileDescriptor, (err3) => {
                        if (!err3) {
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

lib.read = (file, dir, callback) => {
    fs.readFile(`${lib.baseDir + dir}/${file}.json`, 'utf-8', (err, data) => {
        callback(err, data);
    });
};

lib.update = (dir, file, data, callback) => {
    fs.open(`${lib.baseDir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // convert data to string
            const stringData = JSON.stringify(data);

            // Write data and then close it
            fs.ftruncate(fileDescriptor, (err2) => {
                if (!err2) {
                    fs.writeFile(fileDescriptor, stringData, (err3) => {
                        if (!err3) {
                            fs.close(fileDescriptor, (err4) => {
                                if (!err4) {
                                    callback(false);
                                } else {
                                    callback('errror closing file');
                                }
                            });
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

lib.delete = (dir, file, callback) => {
    fs.unlink(`${lib.baseDir + dir}/${file}.json`, (errorr) => {
        if (!errorr) {
            callback(false);
        } else callback('Error deleting file');
    });
};

module.exports = lib;
