'use strict';

angular.module('projectsApp')
  .controller('MainCtrl', function ($scope, $http) {
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

    // Color filter
    $scope.colorOptions = [
      {name: 'Any'},
      {name: 'Red'},
      {name: 'White'},
      {name: 'Black'},
      {name: 'Blue'},
      {name: 'Yellow'},
      {name: 'Green'}
    ];
    $scope.color = $scope.colorOptions[0];

    $scope.filterProd = function(prod) {
      if (!prod) {
        return false;
      }

      if ($scope.showInStockOnly) {
        if (!prod.in_stock) {
          return false;
        }
      }

      if ($scope.priceMin) {
        if (prod.price < $scope.priceMin) {
          return false;
        }
      }

      if ($scope.priceMax) {
        if (prod.price > $scope.priceMax) {
          return false;
        }
      }

      if ($scope.color && $scope.color.name !== 'Any') {
        if (prod.color !== $scope.color.name) {
          return false;
        }
      }

      if ($scope.filterDtFrom && prod.issued) {
        if (prod.issued.getTime() < $scope.filterDtFrom.getTime()) {
          return false;
        }
      }

      if ($scope.filterDtTo && prod.issued) {
        if (prod.issued.getTime() > $scope.filterDtTo.getTime()) {
          return false;
        }
      }

      return true;
    };

    // Filter
    ///////////////////////////////////////////////////////


    //=====================================================
    // Product list

    $scope.products = [];

    $scope.loadProducts = function (localPath) {
      $http.get(localPath).then(
        function (resp) {
          var prods = resp.data;
          prods.forEach(function (prod) {
            prod.price = prod.price / 60.0;
          });
          $scope.products = prods;
        },
        function (err) {
          console.log(err.message);
          console.error(err);
        }
      );
    };

    $scope.loadProducts('assets/json/products.json');

    $scope.onBuyBtnClick = function (prod) {
      console.log('buy');
      console.log(prod);
    };

    // Product list
    //=====================================================
  });
