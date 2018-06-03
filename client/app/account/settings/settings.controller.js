'use strict';

angular.module('projectsApp')
  .controller('SettingsCtrl', function ($scope, Auth) {
    $scope.errors = {};

    $scope.changePassword = function (form) {
      $scope.submitted = true;
      if (form.$valid) {
        Auth.changePassword($scope.user.oldPassword, $scope.user.newPassword).then(
          function () {
            $scope.message = 'Password successfully changed.';
          },
          function () {
            $scope.message = 'Old password is incorrect.';
          }
        )
          .catch(function () {
            form.password.$setValidity('mongoose', false);
            $scope.errors.other = 'Incorrect password';
            $scope.message = '';
          });
      }
    };
  });
