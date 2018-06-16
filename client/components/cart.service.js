'use strict';

angular.module('projectsApp')
  .factory('Cart', function Cart() {

    var cart = [];

    function getItems() {
      return cart;
    }

    function getCount() {
      return cart.length;
    }

    function add(prod) {
      var existing = _.find(cart, function (p) {
        return p === prod;
      });
      if (existing) {
        return false;
      }
      else {
        cart.push(prod);
        return true;
      }
    }

    function rem(prod) {
      _.remove(cart, function (p) {
        return p === prod;
      });
    }

    function clear() {
      cart = [];
    }

    return {
      getItems: getItems,
      getCount: getCount,
      add: add,
      rem: rem,
      clear: clear
    };
  });
