'use strict';

angular.module('projectsApp')
  .controller('SignupCtrl', function ($scope, Auth, $location) {
    $scope.user = {};
    $scope.requestError = null;
    $scope.passwordConfirm = '';

    $scope.register = function (form) {
      if (form.$valid) {
        Auth.createUser({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then(
          function () {
            // Account created, redirect to home
            $location.path('/');
          },
          function (err) {
            if (err) {
              $scope.requestError = err;
            }
          }
        );
      }
    };

    $scope.onFormChange = function() {
      $scope.requestError = null;
    };


    $scope.onPasswordConfirmChange = function () {
      $scope.onFormChange();

      $scope.form.passwordConfirm.$setValidity('match',
        $scope.form.password.$modelValue === $scope.form.passwordConfirm.$modelValue);
    };

  });
