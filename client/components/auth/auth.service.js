'use strict';

angular.module('projectsApp')
  .factory('Auth', function Auth($location, $rootScope, $cookieStore, $q, Cart) {
    var users = [
      {
        name: 'Tester',
        role: 'user',
        email: 'test@test.com',
        password: 'test'
      },
      {
        name: 'Admin',
        role: 'admin',
        email: 'admin@admin.com',
        password: 'admin'
      }
    ];
    var currentUser = {};

    var token = $cookieStore.get('token');
    if (token) {
      currentUser = _.find(users, function (u) {
        return u.password === token;
      });
    }

    /**
     * Delete access token and user info
     *
     * @param  {Function}
     */
    function logout() {
      $cookieStore.remove('token');
      currentUser = {};
      Cart.clear();
    }

    /**
     * Authenticate user and save token
     *
     * @param  {Object} data - login info
     * @return {Promise}
     */
    function login(data) {
      var deferred = $q.defer();

      var user = _.find(users, function (u) {
        return u.email === data.email && u.password === data.password;
      });

      if (!user) {
        var err = new Error('Wrong email or password');
        logout();
        deferred.reject(err);
        return deferred.promise;
      }

      $cookieStore.put('token', user.password);
      currentUser = user;
      deferred.resolve(user);

      return deferred.promise;
    }

    /**
     * Create a new user
     *
     * @param  {Object}   user     - user info
     * @return {Promise}
     */
    function createUser(user) {
      var deferred = $q.defer();

      var existingUser = _.find(users, function (u) {
        return u.email === user.email;
      });

      if (existingUser) {
        var err = new Error('User with specified email already exist');
        logout();
        deferred.reject(err);
        return deferred.promise;
      }

      // Add new user
      var newUser = {
        name: user.name,
        role: 'user',
        email: user.email,
        password: user.password
      };
      users.push(newUser);
      $cookieStore.put('token', user.password);
      currentUser = newUser;
      deferred.resolve(newUser);

      return deferred.promise;
    }

    /**
     * Gets all available info on authenticated user
     *
     * @return {Object} user
     */
    function getCurrentUser() {
      return currentUser;
    }

    /**
     * Get auth token
     */
    function getToken() {
      return $cookieStore.get('token');
    }

    /**
     * Check if a user is logged in
     *
     * @return {Boolean}
     */
    function isLoggedIn() {
      return !!getToken();
    }

    /**
     * Waits for currentUser to resolve before checking if user is logged in
     */
    function isLoggedInAsync(cb) {
      if (currentUser.hasOwnProperty('role')) {
        cb(true);
      } else {
        cb(false);
      }
    }

    /**
     * Check if a user is an admin
     *
     * @return {Boolean}
     */
    function isAdmin() {
      return currentUser.role === 'admin';
    }

    return {
      login:            login,
      logout:           logout,
      createUser:       createUser,
      getCurrentUser:   getCurrentUser,
      isLoggedIn:       isLoggedIn,
      isLoggedInAsync:  isLoggedInAsync,
      isAdmin:          isAdmin
    };
  });
