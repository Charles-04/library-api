const books = require('../src/routes/books');
const users = require('../src/routes/users');
const lending = require('../src/routes/lending');

const routeHandler = {
  _books: books,
  _users: users,
  _lending: lending,
};

routeHandler.Books = (data, callback) => {
  const acceptableHeaders = ["post", "get", "put", "delete"];
  if (acceptableHeaders.indexOf(data.method) > -1) {
    routeHandler._books[data.method](data, callback);
  } else {
    callback(405);
  }
};

routeHandler.Users = (data, callback) => {
  const acceptableHeaders = ["post", "get", "put", "delete"];
  if (acceptableHeaders.indexOf(data.method) > -1) {
    routeHandler._users[data.method](data, callback);
  } else {
    callback(405);
  }
};

routeHandler.Lending = (data, callback) => {
  const acceptableHeaders = ["post", "get", "put", "delete"];
  if (acceptableHeaders.indexOf(data.method) > -1) {
    routeHandler._lending[data.method](data, callback);
  } else {
    callback(405);
  }
};

routeHandler.ping = (data, callback) => {
  callback(200, { response: "server is live" });
};

routeHandler.notfound = (data, callback) => {
  callback(404, { response: 'not found' });
};


module.exports = routeHandler;