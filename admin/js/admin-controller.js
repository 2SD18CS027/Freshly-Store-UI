app.controller("admin-controller", ["$http", "$scope", "$rootScope", "$window", "APIService", function($http, $scope, $rootScope, $window, APIService) {
  $rootScope.activeTab = 'report';
  $scope.main = function(request) {
    $('#loader').show();
    APIService.apiCall(APIEndPoints.getTodaysReport, "GET", "").then(function(successData) {
      $scope.itemsToBuy = successData.data.itemsToBuy;
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
      case "index" :
        $scope.main();
        $window.location.href = "#/"; break;
      case "login" : $window.location.href = "#/login"; break;
      case "items" : $window.location.href = "#/items"; break;
    }
  }

  $scope.changeOrderStatus = function(order, status) {
    $('#loader').show();
    var request = new Object();
    request['orderId'] = order.orderId;
    request['newOrderStatus'] = status;
    APIService.apiCall(APIEndPoints.adminUpdateOrderStatus, "POST", request).then(function(successData) {
      order.status = status;
      $('#loader').hide();
    }, function(errorData) {
      $('#loader').hide();
      $scope.changeView('login');
    });
  }

  $scope.main();
}]);
