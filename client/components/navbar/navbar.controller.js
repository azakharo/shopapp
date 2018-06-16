'use strict';

angular.module('projectsApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, Cart) {
    $scope.menu = [{
      'title': 'Product List',
      'link': '/'
    }];

    $scope.Cart = Cart;

    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
