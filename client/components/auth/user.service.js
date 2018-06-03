'use strict';

angular.module('projectsApp')
  .factory('User', function ($http, $q) {
    const BASE_PATH = '/api/users';

    return {

      get: function () {
        const deffered = $q.defer();

        $http.get(`${BASE_PATH}/me`).then(
          resp => deffered.resolve(resp.data),
          function (resp) {
            log(resp.data); // jshint ignore:line
            deffered.resolve(null);
          }
        );

        return deffered.promise;
      },

      getAll: function () {
        const deffered = $q.defer();

        $http.get(`${BASE_PATH}/`).then(
          resp => deffered.resolve(resp.data),
          function (resp) {
            log(resp.data); // jshint ignore:line
            deffered.resolve(null);
          }
        );

        return deffered.promise;
      },

      changePassword: function (userID, oldPass, newPass) {
        const deffered = $q.defer();

        $http({
          method: 'put',
          url: `${BASE_PATH}/${userID}/password`,
          data: {
            oldPassword: oldPass,
            newPassword: newPass
          }
        }).then(
          () => deffered.resolve(),
          function (resp) {
            log(resp.data); // jshint ignore:line
            deffered.reject();
          }
        );

        return deffered.promise;
      },

      create: function (data) {
        const deffered = $q.defer();

        $http({
          method: 'post',
          url: `${BASE_PATH}/`,
          data: data
        }).then(
          resp => deffered.resolve(resp.data), // return token
          function (resp) {
            log(resp.data); // jshint ignore:line
            deffered.reject(resp.data);
          }
        );

        return deffered.promise;
      },

      delete: function (userID) {
        const deffered = $q.defer();

        $http({
          method: 'delete',
          url: `${BASE_PATH}/${userID}`
        }).then(
          () => deffered.resolve(),
          function (resp) {
            log(resp.data); // jshint ignore:line
            deffered.reject();
          }
        );

        return deffered.promise;
      }

    }; // return
  });
