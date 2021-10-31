const lib = require("./fileUtil");

const helper = {};


helper.generateRandomString = (stringLength) => {
    stringLength = typeof (stringLength) === 'number' ? stringLength : 20;
    var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz1234567890';
    var str = '';
    for (i = 0; i < stringLength; i++) {
        var randomChar = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
        str += randomChar;
    }
    return str;
};

helper.formatObject = (oldObject = {}, newObject = {}) => {
    let tempObj = {}
    Object.keys(newObject).map(key => {
        if (oldObject.hasOwnProperty(key)) {
            tempObj[key] = newObject[key];
        }
    })
    return { ...oldObject, ...tempObj };
};

helper.loadData = (filename, callback) => {
    lib.read(filename, filename, (err, data) => {
        if (!err) {
            return callback(data);
        }
        return callback({});
    });
};

helper.saveData = (filename, data) => {
    if (Object.keys(data).length < 1) {
        lib.create(filename, filename, data, () => { });
    } else {
        lib.update(filename, filename, data, () => { });
    }
};

module.exports = helper;