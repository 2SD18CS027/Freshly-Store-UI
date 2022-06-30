app.controller("index-controller", ["$http", "$scope", "$rootScope", "$window", "APIService", function($http, $scope, $rootScope, $window, APIService) {
  $rootScope.isAccountKitInitialized = false;
  $rootScope.isMainApiCalled = false;

  $rootScope.main = function() {
    $('#loader').show();
    var token = readCookie("veggie-market-cookie");
    $rootScope.isUserLoggedIn = false;
    $rootScope.deviceTypeId = 1;
    $rootScope.userActiveAddress = null;
    if(token != null) {

    }

    APIService.apiCall(APIEndPoints.getHomePageDetails, "GET", "").then(function(successData) {
      if(successData.data.allItemDetails == null) {
        window.location.reload();
      }

      $rootScope.isUserLoggedIn = successData.data.isUserLoggedIn;
      $rootScope.allItemDetails = successData.data.allItemDetails;
      $rootScope.activeCategory = successData.data.allItemDetails.categories[0];
      $rootScope.itemsToDisplay = [];

      for(var i=0; i<$rootScope.allItemDetails.items.length; i++) {
        if($rootScope.allItemDetails.items[i].category   === $rootScope.activeCategory) {
          $rootScope.itemsToDisplay.push( $rootScope.allItemDetails.items[i] );
        }
      }

      $rootScope.slotTimes = successData.data.slotTimes;
      if($rootScope.isUserLoggedIn) {
        $rootScope.name = successData.data.name;
        $rootScope.mobileNumber = successData.data.mobileNumber;
        $rootScope.emailId = successData.data.emailId;
        if($rootScope.emailId == null) $rootScope.emailId = 'Add your email...';
        $rootScope.userAddresses = successData.data.userAddresses;
        for(var i=0; i<successData.data.userAddresses.length; i++) {
          if(successData.data.userAddresses[i].active) {
            $rootScope.userActiveAddress = successData.data.userAddresses[i].address;
            break;
          }
        }
        if($rootScope.userActiveAddress == null && successData.data.userAddresses.length > 0) {
          $rootScope.userActiveAddress = successData.data.userAddresses[0].address;
        }
        if($rootScope.userActiveAddress == null) {
          $rootScope.userActiveAddress = "Add Your Delivery Address...";
        }
      }
      $rootScope.totalCartItems = successData.data.totalCartItems;
      $rootScope.serviceableCities = [];
      $rootScope.serviceableAreas = [];
      $rootScope.serviceableAreasArr = [];

      for(var i=0; i<successData.data.serviceableAreas.length; i++) {
        $rootScope.serviceableCities.push( successData.data.serviceableAreas[i].city );
        if(i==0) {
          $rootScope.selectedCityName = successData.data.serviceableAreas[i].city;
          for(var j=0; j<successData.data.serviceableAreas[i].areas.length; j++) {
            $rootScope.serviceableAreas.push( successData.data.serviceableAreas[i].areas[j].area );
            $rootScope.serviceableAreasArr.push( successData.data.serviceableAreas[i].areas[j] );
          }
        }
      }
      $rootScope.selectedAreaName = readCookie('the-freshly-store-area-cookie');
      if($rootScope.selectedAreaName == null) {
        console.log("Not Set!");
        var now = new Date();
        var time = now.getTime();
        var expireTime = time + (24 * 60 * 60 * 1000);
        now.setTime(expireTime);
        document.cookie = "the-freshly-store-area-cookie=" + $rootScope.serviceableAreas[0]; + ";expires=" + now.toGMTString();
        $rootScope.selectedAreaName = readCookie('the-freshly-store-area-cookie');
      }
      $rootScope.isMainApiCalled = true;

      $('#loader').hide();
    }, function(errorData) {
      console.log(errorData);
      $('#loader').hide();
    });
  }

  $rootScope.changeView = function(view) {
    switch(view) {
      case "index" :
        $rootScope.main();
        $window.location.href = "#"; break;
      case "login" : $window.location.href = "#login"; break;
      case "register" : $window.location.href = "#register"; break;
      case "user-address" : $window.location.href = "#user-address"; break;
      case "account" : $window.location.href = "#account"; break;
      case "cart" :
        if($rootScope.isUserLoggedIn) {
          $window.location.href = "#cart";
        } else {
          swal({
            title: "Login Please!",
            icon: "error"
          }).then(function(isConfirm) {
            $rootScope.changeView('login');
          });
        }
        break;
        case "help" : $window.location.href = "#help"; break;
        case "capture-user-details" : $window.location.href = "#capture-user-details"; break;
        case "privacy-policy" : $window.location.href = "#privacy-policy"; $("html, body").animate({ scrollTop: 0 }, "slow"); break;
    }
  }

  $rootScope.logout = function() {
    $('#loader').show();
    var token = (readCookie('the-freshly-store-cookie'));
    var url = APIEndPoints.logout + token;
    APIService.apiCall(url, "DELETE", "").then(function(successData) {
      $rootScope.deleteUserDetails();
    }, function(errorData) {
      $rootScope.deleteUserDetails();
    });
  }

  $rootScope.deleteUserDetails = function() {
    $rootScope.isUserLoggedIn = false;
    deleteCookie('veggie-market-cookie');
    $('#loader').hide();
    $rootScope.userAddresses = [];
    $rootScope.userActiveAddress = null;
    $rootScope.name = null;
    $rootScope.mobileNumber = null;
    $rootScope.emailId = null;
    $rootScope.totalCartItems = 0;
    $rootScope.changeView('index');
  }

  $rootScope.checkLoginStatus = function(errorData) {
    if(errorData != null && errorData.status == 401) {
      swal({
        title: "Your Session has Expired. Please Login Again!",
        icon: "error"
      }).then(function(isConfirm) {
        $('#loader').hide();
        $rootScope.deleteUserDetails();
        $rootScope.changeView('login');
      });
    }
  }

  $rootScope.updateDefaultAddress = function() {
    var now = new Date();
    var time = now.getTime();
    var expireTime = time + (24 * 60 * 60 * 1000);
    now.setTime(expireTime);
    document.cookie = "the-freshly-store-area-cookie=" + $scope.selectedAreaName + ";expires=" + now.toGMTString();
  }

  $rootScope.scrollToTop = function() {
    $("html, body").animate({ scrollTop: 0 }, "slow");
  }

  $rootScope.validateEmail = function(email){
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    return reg.test(email);
  }

  $rootScope.main();
}]);
