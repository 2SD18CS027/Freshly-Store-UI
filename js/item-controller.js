app.controller("item-controller", ["$http", "$scope", "$rootScope", "$window", "APIService", function($http, $scope, $rootScope, $window, APIService) {

  $scope.increaseQty = function(item) {
    item.cartQty++;
    var request = new Object();
    request['itemId'] = item.itemId;
    request['quantity'] = item.cartQty;
    request['isDelete'] = (item.cartQty == 0) ? true : false;
    $scope.apiCall(request);
  }

  $scope.decreaseQty = function(item) {
    item.cartQty--;
    var request = new Object();
    request['itemId'] = item.itemId;
    request['quantity'] = item.cartQty;
    request['isDelete'] = (item.cartQty == 0) ? true : false;
    $scope.apiCall(request);
    if(item.cartQty == 0) $rootScope.totalCartItems--;
  }

  $scope.addToCart = function(item) {
    if(!$rootScope.isUserLoggedIn) {
      swal({
        title: "Register or Login Please!",
        icon: "error"
      }).then(function(isConfirm) {
        $rootScope.changeView('login');
      });
      return;
    }
    item.cartQty=1;
    var request = new Object();
    request['itemId'] = item.itemId;
    request['quantity'] = item.cartQty;
    request['isDelete'] = (item.cartQty == 0) ? true : false;
    $scope.apiCall(request);
    $rootScope.totalCartItems++;
  }

  $scope.changeCategory = function(changeCategory) {
    document.getElementById('searchInput').value = "";
    $rootScope.itemsToDisplay = [];
    $rootScope.activeCategory = changeCategory;
    for(var i=0; i<$rootScope.allItemDetails.items.length; i++) {
      if($rootScope.allItemDetails.items[i].category   === $rootScope.activeCategory) {
        $rootScope.itemsToDisplay.push( $rootScope.allItemDetails.items[i] );
      }
    }
  }

  $scope.apiCall = function(request) {
    APIService.apiCall(APIEndPoints.addOrUpdateCart, "POST", request).then(function(successData) {
    }, function(errorData) {
      $rootScope.checkLoginStatus();
    });
  }

  $scope.searchItems = function() {
    var searchTerm = $('#searchInput').val();
    $rootScope.itemsToDisplay = [];
    if(searchTerm != null && searchTerm.length > 0) {
      for(var i=0; i<$rootScope.allItemDetails.items.length; i++) {
        if($rootScope.allItemDetails.items[i].category   === $rootScope.activeCategory) {
          if($rootScope.allItemDetails.items[i].name.search(new RegExp(searchTerm, "i")) != -1) {
            $rootScope.itemsToDisplay.push( $rootScope.allItemDetails.items[i] );
          }
        }
      }
    } else {
      for(var i=0; i<$rootScope.allItemDetails.items.length; i++) {
        if($rootScope.allItemDetails.items[i].category   === $rootScope.activeCategory) {
          $rootScope.itemsToDisplay.push( $rootScope.allItemDetails.items[i] );
        }
      }
    }
  }

}]);
