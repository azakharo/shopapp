'use strict';

angular.module('projectsApp')
  .factory('Auth', function Auth($location, $rootScope, $http, User, $cookieStore, $q) {
    var currentUser = {};
    if ($cookieStore.get('token')) {
      User.get().then(user => currentUser = user);
    }

    /**
     * Delete access token and user info
     *
     * @param  {Function}
     */
    function logout() {
      $cookieStore.remove('token');
      currentUser = {};
    }

    /**
     * Authenticate user and save token
     *
     * @param  {Object}   user     - login info
     * @param  {Function} callback - optional
     * @return {Promise}
     */
    function login(user, callback) {
      var cb = callback || angular.noop;
      var deferred = $q.defer();

      $http.post('/auth/local', {
        email: user.email,
        password: user.password
      })
      .success(function (data) {
        $cookieStore.put('token', data.token);
        User.get().then(
          function (u) {
            currentUser = u;
            deferred.resolve(data);
            return cb();
          }
        );
      })
      .error(function (err) {
        logout();
        deferred.reject(err);
        return cb(err);
      });

      return deferred.promise;
    }

    /**
     * Create a new user
     *
     * @param  {Object}   user     - user info
     * @param  {Function} callback - optional
     * @return {Promise}
     */
    function createUser(user, callback) {
      var cb = callback || angular.noop;

      return User.create(user).then(
        function (data) {
          $cookieStore.put('token', data.token);
          User.get().then(function (u) {
            currentUser = u;
            return cb(null, user);
          });
        },
        function (err) {
          logout();
          return cb(err, null);
        }
      );
    }

    /**
     * Change password
     *
     * @param  {String}   oldPassword
     * @param  {String}   newPassword
     * @param  {Function} callback    - optional
     * @return {Promise}
     */
    function changePassword(oldPassword, newPassword) {
      return User.changePassword(currentUser._id, oldPassword, newPassword);
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
     * Check if a user is logged in
     *
     * @return {Boolean}
     */
    function isLoggedIn() {
      return currentUser.hasOwnProperty('role');
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

    /**
     * Get auth token
     */
    /* jshint ignore:start */
    function getToken() {
      return $cookieStore.get('token');
    }
    /* jshint ignore:end */

    return {
      login:            login,
      logout:           logout,
      createUser:       createUser,
      changePassword:   changePassword,
      getCurrentUser:   getCurrentUser,
      isLoggedIn:       isLoggedIn,
      isLoggedInAsync:  isLoggedInAsync,
      isAdmin:          isAdmin
    };
  });
