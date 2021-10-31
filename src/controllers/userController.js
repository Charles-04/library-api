const helper = require('../../lib/helper');

let users = {};

const save = () => {
    helper.saveData('users', users);
};

const validatePayload = (payload, callback) => {
    const name = (typeof (payload.name) === 'string') && (payload.name.trim().length > 0)
        ? payload.name : false;
    const address = (typeof (payload.address) === 'string') && (payload.address.trim().length > 0)
        ? payload.address : false;
    const phone = (typeof (payload.phone) === 'string') && (payload.phone.trim().length > 0)
        ? payload.phone : false;

    if (name && address && phone) {
        return callback(false, payload);
    }
    return callback(true, null);
};

const userModel = {
    id: null,
    name: null,
    address: null,
    phone: null,
    createdOn: null,
    updatedOn: null,
};

module.exports = {
    loadUsers: () => {
        helper.loadData('users', data => {
            users = data;
            if (Object.keys(data).length < 1) {
                save();
            }
        });
    },
    createUser: (data, callback) => {
        //validate that all required fields are filled out
        validatePayload(data.payload, (err, payload) => {
            if (!err) {
                const id = helper.generateRandomString(10);
                const newUser = helper.formatObject(userModel, { ...payload, id, createdOn: new Date().toJSON() });
                users[id] = newUser;
                save();
                callback(200, { message: "user added successfully", data: newUser });
            } else {
                callback(400, { message: "Some fiedls are incorrect" });
            }
        });
    },
    getUser: (data, callback) => {
        const id = data.query.id;

        if (id && users[id]) {
            callback(200, { message: 'user retrieved', data: users[id]});
        } else {
            callback(404, { message: 'user not found', data: null });
        }
    },
    getAllUsers: (data, callback) => {
        callback(200, { message: 'users retrived', data: Object.values(users) });
    },
    updateUser: (data, callback) => {
        const id = data.query.id;

        if (id && users[id]) {
            const userUpdate = helper.formatObject(users[id], { ...data.payload, updatedOn: new Date().toJSON()});
            users[id] = userUpdate;
            save();
            callback(200, { message: 'user updated successfully', data: userUpdate });
        } else {
            callback(404, { message: 'user not found', data: null });
        }
    },
    deleteUser: (data, callback) => {
        const id = data.query.id;

        if (id && users[id]) {
            delete users[id];
            save();
            callback(200, { message: 'user deleted successfully', data: null });
        } else {
            callback(404, { message: 'user not found' });
        }
    },
};
