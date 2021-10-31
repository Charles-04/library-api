const bookController = require('../controllers/bookController');

bookController.loadBooks();

module.exports = {
    //Post route -- for creating a book
    post: bookController.createBook,

    //Get route -- for geting a book or all books
    get: (data, callback) => {
        const id = data.query.id;
        if (id) {
            bookController.getBook(data, callback);
        } else {
            bookController.getAllBooks(data, callback);
        }
    },

    //Put route -- for updating a book
    put: bookController.updateBook,

    //Delete route -- for deleting a book
    delete: bookController.deleteBook,
};
