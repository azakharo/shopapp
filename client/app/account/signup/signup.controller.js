'use strict';

angular.module('projectsApp')
  .controller('SignupCtrl', function ($scope, Auth, $location, $window) {
    $scope.user = {};
    $scope.errors = {};

    $scope.register = function (form) {
      $scope.submitted = true;

      if (form.$valid) {
        Auth.createUser({
            name: $scope.user.name,
            email: $scope.user.email,
            password: $scope.user.password
          },
          function (err, user) {
            /* jshint unused:false */
            if (err) {
              if (typeof err === 'string') {
                form.email.$setValidity('mongoose', false);
                $scope.errors.email = err;
              }
              else {
                err = err.data;
                $scope.errors = {};

                // Update validity of form fields that match the mongoose errors
                angular.forEach(err.errors, function (error, field) {
                  form[field].$setValidity('mongoose', false);
                  $scope.errors[field] = error.message;
                });
              }
            }
            else {
              // Account created, redirect to home
              $location.path('/');
            }
          }
        );
      }
    };

    $scope.loginOauth = function (provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
