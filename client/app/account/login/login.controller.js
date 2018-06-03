'use strict';

angular.module('projectsApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $window) {
    $scope.user = {};
    $scope.requestError = null;

    $scope.login = function(form) {
      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          $scope.requestError = err.message;
        });
      }
    };

    $scope.onFormChange = function() {
      $scope.requestError = null;
    };

  });
