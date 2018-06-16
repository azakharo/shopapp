'use strict';

angular.module('projectsApp')
  .directive('rating', function () {
    return {
      scope: {
        value: '='
      },
      controller: 'RatingCtrl',
      templateUrl: 'components/rating/rating.html'
    };
  })
  .controller('RatingCtrl', function ($scope) {
    console.log('RatingCtrl');
    console.log($scope);
  });
