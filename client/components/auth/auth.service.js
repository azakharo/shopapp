'use strict';

angular.module('projectsApp')
  .factory('Auth', function Auth($location, $rootScope, $cookieStore, $q, Cart) {
    var users = [];


    ////////////////////////////////////////////////////////////
    // User persistence

    var STORAGE_KEY__USERS = 'users';

    function _loadUsers() {
      var storage = window.localStorage;
      if (storage) {
        var data = storage.getItem(STORAGE_KEY__USERS);
        if (data) {
          users = JSON.parse(data);
        }
        else {
          // Set builtin users
          users = [
            {
              name: 'Tester',
              role: 'user',
              email: 'test@test.com',
              password: 3556498
            },
            {
              name: 'Admin',
              role: 'admin',
              email: 'admin@admin.com',
              password: 92668751
            }
          ];

          _saveUsers();
        }
      }

    }

    function _saveUsers() {
      var storage = window.localStorage;
      if (storage) {
        var data = JSON.stringify(users);
        storage.setItem(STORAGE_KEY__USERS, data);
      }
    }

    _loadUsers();

    // User persistence
    ////////////////////////////////////////////////////////////


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

      var passwdHash = _createHashCode(data.password);
      var user = _.find(users, function (u) {
        return u.email === data.email && u.password === passwdHash;
      });

      if (!user) {
        var err = new Error('Wrong email or password');
        logout();
        deferred.reject(err);
        return deferred.promise;
      }

      $cookieStore.put('token', passwdHash);
      currentUser = user;
      deferred.resolve(user);

      return deferred.promise;
    }

    /**
     * Create a new user
     *
     * @param  {Object}   data     - user info
     * @return {Promise}
     */
    function createUser(data) {
      var deferred = $q.defer();

      var existingUser = _.find(users, function (u) {
        return u.email === data.email;
      });

      if (existingUser) {
        var err = new Error('User with specified email already exist');
        logout();
        deferred.reject(err);
        return deferred.promise;
      }

      // Add new user
      var passwdHash = _createHashCode(data.password);
      var newUser = {
        name: data.name,
        role: 'user',
        email: data.email,
        password: passwdHash
      };
      users.push(newUser);
      $cookieStore.put('token', passwdHash);
      currentUser = newUser;
      _saveUsers();
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

    function _createHashCode(s) {
      var hash = 0, i, chr;
      if (s.length === 0) {
        return hash;
      }
      for (i = 0; i < s.length; i++) {
        chr   = s.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr; // jshint ignore:line
        // Convert to 32bit integer
        hash |= 0; // jshint ignore:line
      }
      return hash;
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
