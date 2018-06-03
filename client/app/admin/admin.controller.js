'use strict';

angular.module('projectsApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User) {

    User.getAll().then(
      function (data) {
        $scope.users = data;
      }
    );

    $scope.delete = function(user) {
      User.delete(user._id).then(function () {
        angular.forEach($scope.users, function(u, i) {
          if (u === user) {
            $scope.users.splice(i, 1);
          }
        });
      });
    };
  });
