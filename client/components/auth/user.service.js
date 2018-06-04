'use strict';

angular.module('projectsApp')
  .factory('User', function ($http, $q) {
    var BASE_PATH = '/api/users';

    return {

      get: function () {
        var deffered = $q.defer();

        $http.get(BASE_PATH + '/me').then(
          function (resp) {
            deffered.resolve(resp.data);
          },
          function (resp) {
            log(resp.data); // jshint ignore:line
            deffered.resolve(null);
          }
        );

        return deffered.promise;
      },

      getAll: function () {
        var deffered = $q.defer();

        $http.get(BASE_PATH + '/').then(
          function (resp) {
            deffered.resolve(resp.data);
          },
          function (resp) {
            log(resp.data); // jshint ignore:line
            deffered.resolve(null);
          }
        );

        return deffered.promise;
      },

      changePassword: function (userID, oldPass, newPass) {
        var deffered = $q.defer();

        $http({
          method: 'put',
          url: BASE_PATH + '/' + userID + '/password',
          data: {
            oldPassword: oldPass,
            newPassword: newPass
          }
        }).then(
          function () {
            deffered.resolve();
          },
          function (resp) {
            log(resp.data); // jshint ignore:line
            deffered.reject();
          }
        );

        return deffered.promise;
      },

      create: function (data) {
        var deffered = $q.defer();

        $http({
          method: 'post',
          url: BASE_PATH + '/',
          data: data
        }).then(
          function (resp) {
            // return token
            deffered.resolve(resp.data);
          },
          function (resp) {
            log(resp.data); // jshint ignore:line
            deffered.reject(resp.data);
          }
        );

        return deffered.promise;
      },

      delete: function (userID) {
        var deffered = $q.defer();

        $http({
          method: 'delete',
          url: BASE_PATH + '/' + userID
        }).then(
          function () {
            deffered.resolve();
          },
          function (resp) {
            log(resp.data); // jshint ignore:line
            deffered.reject();
          }
        );

        return deffered.promise;
      }

    }; // return
  });
