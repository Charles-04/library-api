const helper = require('../../lib/helper');
const lendingController = require('./lendingController');

let books = {};

const save = () => {
    helper.saveData('books', books);
};

const validatePayload = (payload, callback) => {
    const name = (typeof (payload.name) === 'string') && (payload.name.trim().length > 0)
        ? payload.name : false;
    const price = (typeof (payload.price) === 'string') && !isNaN(parseInt(payload.price))
        ? payload.price : false;
    const author = (typeof (payload.author) === 'string') && (payload.author.trim().length > 0)
        ? payload.author : false;
    const publisher = (typeof (payload.publisher) === 'string') && (payload.publisher.trim().length > 0)
        ? payload.publisher : false;
    const quantity = (typeof (payload.quantity) === 'string') && !isNaN(parseInt(payload.quantity))
        ? payload.quantity : false;

    if (name && price && author && publisher && quantity) {
        return callback(false, payload);
    }
    return callback(true, null);
};

const bookModel = {
    id: null,
    name: null,
    price: null,
    author: null,
    publisher: null,
    isbn_number: null,
    cover_image_url: null,
    quantity: null,
    createdOn: null,
    updatedOn: null,
};

module.exports = {
    loadBooks: () => {
        helper.loadData('books', data => {
            books = data;
            if (Object.keys(data).length < 1) {
                save();
            }
        });
    },
    createBook: (data, callback) => {
        //validate that all required fields are filled out
        validatePayload(data.payload, (err, payload) => {
            if (!err) {
                const id = helper.generateRandomString(30);
                const newBook = helper.formatObject(bookModel, {
                    ...payload,
                    id,
                    createdOn: new Date().toJSON(),
                });
                books[id] = newBook;
                save();
                callback(200, { message: "book added successfully", data: newBook });
            } else {
                callback(400, { message: "Some fiedls are incorrect" });
            }
        });
    },
    getBook: (data, callback) => {
        const id = data.query.id;

        if (id && books[id]) {
            const data = {
                ...books[id],
                available: lendingController.getAvailable(
                    books[id].id,
                    books[id].quantity,
                ),
            }
            callback(200, { message: 'book retrieved', data });
        } else {
            callback(404, { message: 'book not found', data: null });
        }
    },
    getAllBooks: (data, callback) => {
        const all = Object.values(books).map(book => ({
            ...book,
            available: lendingController.getAvailable(
                book.id,
                book.quantity,
            ),
        }));
        callback(200, { message: 'books retrived', data: all });
    },
    updateBook: (data, callback) => {
        const id = data.query.id;

        if (id && books[id]) {
            const bookUpdate = helper.formatObject(books[id], { ...data.payload, updatedOn: new Date().toJSON() });
            books[id] = bookUpdate;
            save();
            callback(200, { message: 'book updated successfully', data: bookUpdate });
        } else {
            callback(404, { message: 'book not found', data: null });
        }
    },
    deleteBook: (data, callback) => {
        const id = data.query.id;

        if (id && books[id]) {
            delete books[id];
            save();
            callback(200, { message: 'book deleted successfully', data: null });
        } else {
            callback(404, { message: 'book not found' });
        }
    },
};
