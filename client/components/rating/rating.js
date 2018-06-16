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
    var val = $scope.value;
    $scope.fullStars = Math.floor(val);
    var roundedVal = Math.round(val);
    $scope.isHalfStar = roundedVal !== val;
    $scope.range = _.range;
  });
