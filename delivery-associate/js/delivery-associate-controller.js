app.controller("delivery-associate-controller", ["$http", "$scope", "$rootScope", "$window", "APIService", function($http, $scope, $rootScope, $window, APIService) {

  $scope.main = function(request) {
    $('#loader').show();
    APIService.apiCall(APIEndPoints.getOrdersToDeliver, "GET", "").then(function(successData) {
      $scope.orders = successData.data.orders;
      $('#loader').hide();
    }, function(errorData) {
      console.log(errorData);
      $('#loader').hide();
      $scope.changeView('login');
    });
  }

  $scope.changeView = function(view) {
    switch(view) {
      case "login" : $window.location.href = "#/login"; break;
      case "items" : $window.location.href = "#/items"; break;
      case "index" : $window.location.href = "#/"; break;
    }
  }

  $scope.displayOrderItems = function(orderId) {
    $('#orderDetails-'+orderId).hide(100);
    $('#itemDetails-'+orderId).show(100);
  }

  $scope.displayOrder = function(orderId) {
    $('#orderDetails-'+orderId).show(100);
    $('#itemDetails-'+orderId).hide(100);
  }

  $scope.deliveryOrder = function(order) {
    $('#loader').show();
    var request = new Object();
    request['orderId'] = order.orderId;
    request['newOrderStatus'] = 4;
    APIService.apiCall(APIEndPoints.updateOrderStatus, "POST", request).then(function(successData) {
      order.status = 4;
      $('#loader').hide();
    }, function(errorData) {
      $('#loader').hide();
      $scope.changeView('login');
    });
  }

  $scope.main();

}]);
