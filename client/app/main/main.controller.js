'use strict';

angular.module('projectsApp')
  .controller('MainCtrl', function ($scope) {
    ///////////////////////////////////////////////////////
    // Filter

    $scope.datepickerOpts = {
      startingDay: 1,
      showWeeks: false
    };
    $scope.datepickerInputFrmt = 'yyyy-MM-dd';

    // Date From
    $scope.filterDtFrom = null;
    $scope.isFilterDtFromOpened = false;
    $scope.openFilterDtFrom = function () {
      $scope.isFilterDtFromOpened = true;
    };

    // Date To
    $scope.filterDtTo = null;
    $scope.isFilterDtToOpened = false;
    $scope.openFilterDtTo = function () {
      $scope.isFilterDtToOpened = true;
    };

    $scope.showInStockOnly = false;

    $scope.priceMin = null;
    $scope.priceMax = null;

    // Filter
    ///////////////////////////////////////////////////////


  });
