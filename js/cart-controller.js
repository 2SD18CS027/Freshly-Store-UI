app.controller("cart-controller", ["$http", "$scope", "$rootScope", "$window", "APIService", function($http, $scope, $rootScope, $window, APIService) {

  $scope.totalCost = 0;
  $scope.deliveryFee = 0;
  $scope.selectedAddressIdForCheckout = null;
  $scope.isAddressDisplayed = false;
  $scope.isDeliverySlotDisplayed = false;
  $scope.selectedDeliverySlot = null;
  $scope.promocode = null;
  $scope.discount = 0;
  $scope.actualCartCost = 0;
  $scope.minimumOrderAmount = -1;

  $scope.increaseQty = function(item) {
    item.quantity++;
    var request = new Object();
    request['itemId'] = item.itemId;
    request['quantity'] = item.quantity;
    request['isDelete'] = (item.quantity == 0) ? true : false;
    $scope.apiCall(request);
    $scope.recalculateTotalCost();
  }

  $scope.decreaseQty = function(item) {
    item.quantity--;
    var request = new Object();
    request['itemId'] = item.itemId;
    request['quantity'] = item.quantity;
    request['isDelete'] = (item.quantity == 0) ? true : false;
    $scope.apiCall(request);
    if(item.quantity == 0) {
      $rootScope.totalCartItems--;
      for(var i=0; i<$scope.cartItems.length; i++) {
        if($scope.cartItems[i].itemId === item.itemId) {
          $scope.cartItems.splice(i,1);
          break;
        }
      }
    }
    $scope.recalculateTotalCost();
  }

  $scope.recalculateTotalCost = function() {
    $scope.totalCost = 0;
    $scope.actualCartCost = 0;
    if($scope.cartItems != null) {
      for(var i=0; i<$scope.cartItems.length; i++) {
        $scope.totalCost += ($scope.cartItems[i].cost * $scope.cartItems[i].quantity);
      }
      $scope.actualCartCost = ($scope.totalCost + $scope.deliveryFee);
      $scope.actualCartCost -= $scope.discount;
      $scope.totalCost += $scope.deliveryFee;
      $scope.totalCost -= $scope.discount;
    }
  }

  $scope.apiCall = function(request) {
    APIService.apiCall(APIEndPoints.addOrUpdateCart, "POST", request).then(function(successData) {

    }, function(errorData) {
      $rootScope.checkLoginStatus();
    });
  }

  $scope.placeOrder = function() {
    if($scope.selectedAddressIdForCheckout == null) {
      $('#selectDeliveryAddress').notify('Select Delivery Address');
      return;
    }
    if($scope.selectedDeliverySlot == null) {
      $('#selectDeliveryAddress').notify('Select Delivery Slot');
      return;
    }
    $scope.recalculateTotalCost();
    if($scope.minimumOrderAmount > $scope.actualCartCost) {
      $rootScope.scrollToTop();
      $.notify(("Minimum amount to place order is : Rs." + ($scope.minimumOrderAmount.toString()) + "/-"));
      return;
    }

    var options = {
      "key": $scope.razorPayKey,
      "amount": ($scope.actualCartCost*100),
      "name": "The Freshly Store",
      "description": "Payment",
      "image": "/main-logo.svg",
      "handler": function (response){
          $scope.capturePaymentAndPlaceOrder($scope.actualCartCost, response.razorpay_payment_id);
      },
      "prefill": {
          "name": $rootScope.name,
          "email": $rootScope.emailId,
          "contact": $rootScope.mobileNumber
      },
      "notes": {
          "address": "Hello World"
      },
      "theme": {
          "color": "#F37254"
      }
    };
    var rzp1 = new Razorpay(options);
    rzp1.open();
  }

  $scope.capturePaymentAndPlaceOrder = function(amount, razorpay_payment_id) {
    $('#loader').show();
    var request = new Object();
    request['totalPrice'] = $scope.actualCartCost;
    request['addressId'] = $scope.selectedAddressIdForCheckout;
    request['razorPaymentId'] = razorpay_payment_id;
    request['fromSlotTime'] = $scope.selectedDeliverySlot.fromSlotTime;
    request['toSlotTime'] = $scope.selectedDeliverySlot.toSlotTime;
    if($scope.promocode != null && $scope.discount != 0) {
      request['promocode'] = $scope.promocode;
    }

    for(var i=0; i<$rootScope.serviceableAreasArr.length; i++) {
      if($rootScope.serviceableAreasArr[i].area === $rootScope.selectedAreaName) {
        request['areaId'] = $rootScope.serviceableAreasArr[i].areaId;
        break;
      }
    }

    APIService.apiCall(APIEndPoints.placeOrder, "POST", request).then(function(successData) {
      $('#loader').show();
      swal({
        title: "Your order is Placed!",
        icon: "success"
      }).then(function(isConfirm) {
        $rootScope.totalCartItems = 0;
        $rootScope.changeView('account');
      });
    }, function(errorData) {
      $('#loader').hide();
      $rootScope.checkLoginStatus();
    });
  }

  $scope.selectAddressForCheckout = function(addressId) {
    if($scope.selectedAddressIdForCheckout == null) {
      swal({
        title: "Info!",
        text: "Orders outside servicable areas will be auto canncelled!",
        icon: "info",
        button: "I Understand!",
      });
    }
    $scope.selectedAddressIdForCheckout = addressId;
  }

  $scope.selectDeliveryDates = function() {
    if($scope.selectedAddressIdForCheckout == null) {
      $('#selectDeliveryAddress').notify('Select Delivery Address');
      return;
    }
    $('#userAddressesCartBox').hide();
    $('#deliverySlotBox').show(100);
    $scope.isAddressDisplayed = false;
    $scope.isDeliverySlotDisplayed = true;
  }

  $scope.selectDeliverySlot = function(slot) {
    $scope.selectedDeliverySlot = slot;
  }

  $scope.selectAddress = function() {
    if($scope.minimumOrderAmount > $scope.actualCartCost) {
      $rootScope.scrollToTop();
      $.notify(("Minimum amount to place order is : Rs." + ($scope.minimumOrderAmount.toString()) + "/-"));
      return;
    }

    if($rootScope.totalCartItems == 0 || $scope.cartItems.length == 0) {
      swal({
        title: "Add Your Items Please!",
        icon: "error"
      }).then(function(isConfirm) {
        $rootScope.changeView('index');
      });
      return;
    }

    $('#loader').show();
    APIService.apiCall(APIEndPoints.getMyAddresses, "GET", "").then(function(successData) {
      console.log(successData.data);
      $scope.addresses = successData.data.addresses;
      $('#cartItemsDiv').hide();
      $('#userAddressesCartBox').show(100);
      $('#loader').hide();
      $scope.isAddressDisplayed = true;
    }, function(errorData) {
      $('#loader').hide();
      $rootScope.checkLoginStatus();
    });
  }

  $scope.cartMainFunction = function() {
    $('#loader').show();
    APIService.apiCall(APIEndPoints.getMyCart, "GET", "").then(function(successData) {
      $scope.cartItems = successData.data.items;
      $scope.slotDateAndTime = successData.data.slotDateAndTime;
      $scope.deliveryFee = successData.data.deliveryFee;
      $scope.razorPayKey = successData.data.razorPayKey;
      $scope.minimumOrderAmount = successData.data.minimumOrderAmount;
      $scope.recalculateTotalCost();
      $('#loader').hide();

      if($scope.cartItems == null || ($scope.cartItems != null && $scope.cartItems.length == 0)) {
        $('#loader').show();
        swal({
          title: "Your cart is empty!",
          icon: "error"
        }).then(function(isConfirm) {
          $rootScope.changeView('index');
        });
      }

      if($scope.minimumOrderAmount > $scope.actualCartCost) {
        $rootScope.scrollToTop();
        $.notify(("Minimum amount to place order is : Rs." + ($scope.minimumOrderAmount.toString()) + "/-"), "info");
      }
    }, function(errorData) {
      $rootScope.checkLoginStatus();
      $('#loader').hide();
    });
  }

  $scope.applyPromocode = function() {
    $scope.promocode = null;
    $scope.discount = 0;
    swal({
      content: {
        element: "input",
        attributes: {
          placeholder: "Type your Promocode",
          type: "name",
        },
      },
    }).then(function(promocode) {
      if(promocode == null || (promocode != null && promocode.length <= 3)) {
        $('#promocodeDiv').notify("Invalid Promocode", "info");
        return;
      }

      $('#loader').show();
      APIService.apiCall((APIEndPoints.checkPromocode + promocode), "GET", "").then(function(successData) {
        $scope.discount = (successData.data.discount);
        $scope.promocode = promocode;
        $scope.recalculateTotalCost();
        $('#loader').hide();
      }, function(errorData) {
        $rootScope.checkLoginStatus();
        $('#loader').hide();
        $('#promocodeDiv').notify(errorData.data.error, "info");
      });

    });
  }

  $scope.cartMainFunction();

}]);
