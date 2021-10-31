const userController = require("../controllers/userController");

userController.loadUsers();

module.exports = {
    //Post route -- for register a user
    post: userController.createUser,

    //Get route -- for geting a user or all users
    get: (data, callback) => {
        const id = data.query.id;
        if (id) {
            userController.getUser(data, callback);
        } else {
            userController.getAllUsers(data, callback);
        }
    },

    //Put route -- for updating a user
    put: userController.updateUser,

    //Delete route -- for deleting a user
    delete: userController.deleteUser,
};
