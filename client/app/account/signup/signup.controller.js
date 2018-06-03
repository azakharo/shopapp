'use strict';

angular.module('projectsApp')
  .controller('SignupCtrl', function ($scope, Auth, $location, $window) {
    $scope.user = {};
    $scope.requestError = null;

    $scope.register = function (form) {
      if (form.$valid) {
        Auth.createUser({
            name: $scope.user.name,
            email: $scope.user.email,
            password: $scope.user.password
          },
          function (err, user) {
            log(err);
            log(user);
            if (err) {
              $scope.requestError = err;
            }
            else {
              // Account created, redirect to home
              $location.path('/');
            }
          }
        );
      }
    };

    $scope.onFormChange = function() {
      $scope.requestError = null;
    };

  });
