const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
  },
<<<<<<< HEAD
=======
  {
    method: 'GET',
    path: '/users/{id}',
    handler: handler.getUserByIdHandler,
  },
  {
    method: 'GET',
    path: '/users',
    handler: handler.getUsersByUsernameHandler,
  },
>>>>>>> 8b582a2ce8cb6c03f198c80a2f81b93c019fee66
];

module.exports = routes;
