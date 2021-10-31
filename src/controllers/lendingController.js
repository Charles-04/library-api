const helper = require('../../lib/helper');

let lendings = {};

const save = () => {
    helper.saveData('lending', lendings);
};

const validatePayload = (payload, callback) => {
    const bookId = (typeof (payload.bookId) === 'string') && (payload.bookId.trim().length > 0)
        ? payload.bookId : false;
    const userId = (typeof (payload.userId) === 'string') && (payload.userId.trim().length > 0)
        ? payload.userId : false;
    const quantity = (typeof (payload.quantity) === 'string') && !isNaN(parseInt(payload.quantity))
        ? payload.quantity : false;

    if (bookId && userId && quantity) {
        return callback(false, payload);
    }
    return callback(true, null);
};

const lendingModel = {
    id: null,
    bookId: null,
    userId: null,
    status: null,
    quantity: null,
    lendOn: null,
    returnedOn: null,
};

module.exports = {
    loadLendings: () => {
        helper.loadData('lendings', data => {
            lendings = data;
            if (Object.keys(data).length < 1) {
                save();
            }
        });
    },
    getAvailable: (bookId, BookQuantity) => {
        let lends = 0;
        Object.values(lendings).forEach(lending => {
            if (lending.bookId === bookId && lending.status === 'lend') {
                lends += lending.quantity;
            }
        });
        return BookQuantity - lends;
    },
    createLending: (data, callback) => {
        //validate that all required fields are filled out
        validatePayload(data.payload, (err, payload) => {
            console.log("payload", payload);
            if (!err) {
                const id = helper.generateRandomString(30);
                const newLending = helper.formatObject(lendingModel, {
                    ...payload,
                    id,
                    status: 'lend',
                    lendOn: new Date().toJSON(),
                });
                lendings[id] = newLending;
                save();
                callback(200, { message: "lending added successfully", data: newLending });
            } else {
                callback(400, { message: "Some fiedls are incorrect" });
            }
        });
    },
    getLending: (data, callback) => {
        const id = data.query.id;

        if (id && lendings[id]) {
            callback(200, { message: 'lending retrieved', data: lendings[id] });
        } else {
            callback(404, { message: 'lending not found', data: null });
        }
    },
    getAllLendings: (data, callback) => {
        callback(200, { message: 'lendings retrived', data: Object.values(lendings) });
    },
    returnLending: (data, callback) => {
        const id = data.query.id;

        if (id && lendings[id]) {
            const lendingUpdate = helper.formatObject(lendings[id], { status: 'returned', returnedOn: new Date().toJSON() });
            lendings[id] = lendingUpdate;
            save();
            callback(200, { message: 'lending updated successfully', data: lendingUpdate });
        } else {
            callback(404, { message: 'lending not found', data: null });
        }
    },
    lendingHistory: (data, callback) => {
        const userId = data.query.userId;
        const all = Object.values(lendings).filter(lending => lending.userId === userId);
        callback(200, { message: 'lending history retrived', data: all });
    },
    deleteLending: (data, callback) => {
        const id = data.query.id;

        if (id && lendings[id]) {
            delete lendings[id];
            save();
            callback(200, { message: 'lending deleted successfully', data: null });
        } else {
            callback(404, { message: 'lending not found' });
        }
    },
};
