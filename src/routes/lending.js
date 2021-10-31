const lendingController = require("../controllers/lendingController");

lendingController.loadLendings();

module.exports = {
    //Post route -- for creating a lending
    post: lendingController.createLending,

    //Get route -- for geting a lending or all lendings
    get: (data, callback) => {
        const id = data.query.id;
        const userId = data.query.userId;
        if (id) {
            lendingController.getLending(data, callback);
        } else if (userId) {
            lendingController.lendingHistory(data, callback);
        } else {
            lendingController.getAllLendings(data, callback);
        }
    },

    //Put route -- for returning a lending
    put: lendingController.returnLending,

    //Delete route -- for deleting a lending
    delete: lendingController.deleteLending,
};
