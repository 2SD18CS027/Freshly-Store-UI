app.controller("user-controller", ["$http", "$scope", "$rootScope", "$window", "APIService", function($http, $scope, $rootScope, $window, APIService) {
  $scope.selectedAddressType = null;
  $scope.count=3;
  $scope.offset=0;
  $rootScope.orderAreMoreItemsAvailable = false;

  $scope.login = function() {
    var loginMobileNumber = $('#loginMobileNumber').val();
    var loginPassword = $('#loginPassword').val();
    if(loginMobileNumber == null || (loginMobileNumber != null && loginMobileNumber.length == 0)) {
      $('#loginMobileNumber').notify("Mobile Number Required!");
      return;
    }
    if(loginMobileNumber.length != 10) {
      $('#loginMobileNumber').notify("10 Digits Plz!");
      return;
    }

    if(loginPassword == null || (loginPassword != null && loginPassword.length == 0)) {
      $('#loginMobileNumber').notify("Mobile Number Required!");
      return;
    }
    if(loginPassword.length <= 5) {
      $('#loginMobileNumber').notify("Minimum 6 characters!");
      return;
    }
    $('#loginSpinner').show();
    var request = new Object();
    request['mobileNumber'] = loginMobileNumber;
    request['password'] = loginPassword;
    request['deviceTypeId'] = $rootScope.deviceTypeId;

    APIService.apiCall(APIEndPoints.login, "POST", request).then(function(successData) {
      console.log(successData.data);

      var now = new Date();
      var time = now.getTime();
      var expireTime = time + (24 * 60 * 60 * 1000);
      now.setTime(expireTime);
      document.cookie = "the-freshly-store-cookie=" + successData.data.token + ";expires=" + now.toGMTString();
      $rootScope.isUserLoggedIn = true;
      $rootScope.name = successData.data.name;
      $('#loginSpinner').hide();
      $rootScope.main();
      $rootScope.changeView('index');
    }, function(errorData) {
      console.log(errorData);
      $('#loginSpinner').hide();
    });
  }

  $scope.register = function() {
    var registerName = $('#registerName').val();
    var registerEmail = $('#registerEmail').val();

    if(registerName == null || (registerName != null && registerName.length < 3)) {
      $('#registerName').notify("Your Name Please!");
      return;
    }
    if(registerEmail == null || (registerEmail != null && registerEmail.length < 13)) {
      $('#registerEmail').notify("Your Email ID Please!");
      return;
    }
    if(registerName.length > 20) {
      $('#registerName').notify("Sorry! We can only store 20 characters.");
      return;
    }
    if(registerEmail.length > 40) {
      $('#registerName').notify("Sorry! We can only store 40 characters.");
      return;
    }
    if(!$rootScope.validateEmail(registerEmail)) {
      $('#registerName').notify("Sorry! Invalid Email Format.");
      return;
    }

    $('#loader').show();
    var request = new Object();
    request['tempToken'] = $rootScope.tempToken;
    request['name'] = registerName;
    request['deviceTypeId'] = 1;
    request['email'] = registerEmail;

    APIService.apiCall(APIEndPoints.captureUserDetails, "POST", request).then(function(successData) {

      var now = new Date();
      var time = now.getTime();
      var expireTime = time + (24 * 60 * 60 * 1000);
      now.setTime(expireTime);
      document.cookie = "the-freshly-store-cookie=" + successData.data.token + ";expires=" + now.toGMTString();
      $rootScope.isUserLoggedIn = true;
      $rootScope.name = successData.data.name;
      $('#loader').hide();
      $rootScope.main();
      $rootScope.changeView('index');
    }, function(errorData) {
      console.log(errorData);
      $.notify(errorData.data.error);
      $('#loader').hide();
    });
  }

  $scope.getMyOrders = function() {
    $('#loader').show();
    var url = APIEndPoints.getMyOrders;
    url = url.replace("@count", $scope.count);
    url = url.replace("@offset", $scope.offset);
    APIService.apiCall(url, "GET", "").then(function(successData) {
      $rootScope.orders = successData.data.orders;
      $rootScope.orderAreMoreItemsAvailable = successData.data.areMoreItemsAvailable;
      $('#loader').hide();
    }, function(errorData) {
      $rootScope.checkLoginStatus();
      $('#loader').hide();
    });
  }

  $rootScope.getOrderStatus = function(status) {
    switch(status) {
      case 1 : return "Order Placed";
      case 2 : return "Processed & Packed";
      case 3 : return "Out for Delivery";
      case 4 : return "Order Delivered!";
    }
  }

  $scope.displayOrderItems = function(orderId) {
    $('#sub-order-tab-'+orderId).show(100);
    $('#main-order-tab-'+orderId).hide(100);
  }

  $scope.hideOrderItems = function(orderId) {
    $('#sub-order-tab-'+orderId).hide(100);
    $('#main-order-tab-'+orderId).show(100);
  }

  $scope.editUserDetails = function(type, defaultValue) {
    switch(type) {
      case 'name' :
        swal({
          content: {
            element: "input",
            attributes: {
              placeholder: "Type your Name",
              type: "name",
              value: defaultValue,
            },
          },
        }).then(function(value) {
          if(value == null || (value != null && value.length == 0)) {
            return;
          }

          if(value.length < 3) {
            $('#editName').notify("Please Provide a Proper Name", "info");
            return;
          }

          if(value.length > 20) {
            $('#editName').notify("Sorry! We can only store 20 characters.");
            return;
          }

          $('#loader').show();
          var request = new Object();
          request['name'] = value;
          APIService.apiCall(APIEndPoints.editUserDetails, "POST", request).then(function(successData) {
            $rootScope.name = value;
            $('#loader').hide();
          }, function(errorData) {
            $rootScope.checkLoginStatus();
            $('#loader').hide();
          });
        });
        break;
      case 'email' :
        swal({
          content: {
            element: "input",
            attributes: {
              placeholder: "Type your Email ID",
              type: "name",
              value : defaultValue,
            },
          },
        }).then(function(value) {
          if(value == null || (value != null && value.length == 0)) {
            return;
          }
          if(value == null || (value != null && value.length < 13)) {
            $('#editEmail').notify("Please Provide a Proper Email", "info");
            return;
          }
          if(value.length > 40) {
            $('#editEmail').notify("Sorry! We can only store 40 characters.");
            return;
          }
          if(!$rootScope.validateEmail(value)) {
            $('#editEmail').notify("Sorry! Invalid Email Format.");
            return;
          }

          $('#loader').show();
          var request = new Object();
          request['email'] = value;
          APIService.apiCall(APIEndPoints.editUserDetails, "POST", request).then(function(successData) {
            $rootScope.emailId = value;
            $('#loader').hide();
          }, function(errorData) {
            $rootScope.checkLoginStatus();
            $('#loader').hide();
          });
        });
        break;
    }
  }

  $scope.addAddress = function() {
    var address = $('#enterAddress').val();
    if(address == null || (address != null && address.length <=10)) {
      $("#enterAddress").notify("Please add a valid Address", "info");
      return;
    }
    var areaId = "";
    var area = "";
    for(var i=0; i<$rootScope.serviceableAreas.length; i++) {
      if($rootScope.selectedAreaName === $rootScope.serviceableAreasArr[i].area) {
        areaId = $rootScope.serviceableAreasArr[i].areaId;
        area = $rootScope.serviceableAreasArr[i].area;
        break;
      }
    }


    var request = new Object();
    request['address'] = address;
    request['areaId'] = areaId;

    $('#loader').show();
    APIService.apiCall(APIEndPoints.addAddress, "POST", request).then(function(successData) {
      console.log(successData.data);
      request['addressId'] = successData.data.addressId;
      request['active'] = true;
      request['area'] = area;
      $rootScope.userAddresses.push(request);
      $('#loader').hide();
      if($rootScope.totalCartItems > 0) {
        $rootScope.changeView('cart');
      }
    }, function(errorData) {
      $rootScope.checkLoginStatus();
      $('#loader').hide();
    });
  }

  $scope.selectAddress = function(addressType) {
    $('#userAddressWork').removeClass('main-color');
    $('#userAddressHome').removeClass('main-color');
    $('#userAddressOther').removeClass('main-color');

    $('#userAddressWork').removeClass('secondary-color');
    $('#userAddressHome').removeClass('secondary-color');
    $('#userAddressOther').removeClass('secondary-color');

    switch(addressType) {
      case "work" :
        $('#userAddressWork').addClass('secondary-color');
        $('#userAddressHome').addClass('main-color');
        $('#userAddressOther').addClass('main-color');
        $scope.selectedAddressType = "WORK";
        break;
      case "home" :
        $('#userAddressWork').addClass('main-color');
        $('#userAddressHome').addClass('secondary-color');
        $('#userAddressOther').addClass('main-color');
        $scope.selectedAddressType = "HOME";
        break;
      case "other" :
        $('#userAddressWork').addClass('main-color');
        $('#userAddressHome').addClass('main-color');
        $('#userAddressOther').addClass('secondary-color');
        $scope.selectedAddressType = "OTHER";
        break;
    }
  }

  $scope.deleteAddress = function(userAddress) {
    swal({
      title: "Are you sure?",
      text: "You are about to delete a saved address",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        $('#loader').show();
        var request = new Object();
        request['addressId'] = userAddress.addressId;
        APIService.apiCall(APIEndPoints.deleteUserAddress, "POST", request).then(function(successData) {
          for(var i=0; i<$rootScope.userAddresses.length; i++) {
            if($rootScope.userAddresses[i].addressId === userAddress.addressId) {
              if($rootScope.userActiveAddress === $rootScope.userAddresses[i].address) {
                $rootScope.userActiveAddress = null;
              }
              $rootScope.userAddresses.splice(i,1);
              break;
            }
          }
          if($rootScope.userActiveAddress == null && $rootScope.userAddresses.length > 0) {
            $rootScope.userActiveAddress = $rootScope.userAddresses[0].address;
          }

          swal("Poof! Address has been deleted!", {
            icon: "success",
          });
          $('#loader').hide();
        }, function(errorData) {
          $rootScope.checkLoginStatus();
          $('#loader').hide();
        });
      }
    });
  }

  $scope.nextOrders = function() {
    $scope.offset = ($scope.offset + $scope.count);
    $scope.getMyOrders();
  }

  $scope.prevOrders = function() {
    $scope.offset = ($scope.offset - $scope.count);
    $scope.getMyOrders();
  }

    {/* login callback */}
    $scope.loginCallback = function(response) {
      if (response.status === "PARTIALLY_AUTHENTICATED") {
        $('#loader').show();
        var request = new Object();
        request['authCode'] = response.code;
        request['deviceTypeId'] = 1;
        request['mobileNumber'] = $scope.mobileNumberToRegister;
        APIService.apiCall(APIEndPoints.loginOrCreateUser, "POST", request).then(function(successData) {
          if(successData.data.isUserDetailsCaptured) {
            var now = new Date();
            var time = now.getTime();
            var expireTime = time + (24 * 60 * 60 * 1000);
            now.setTime(expireTime);
            document.cookie = "the-freshly-store-cookie=" + successData.data.token + ";expires=" + now.toGMTString();
            $rootScope.isUserLoggedIn = true;
            $('#loginSpinner').hide();
            $rootScope.main();
            $rootScope.changeView('index');
          } else {
            $rootScope.tempToken = successData.data.token;
            $rootScope.changeView('capture-user-details');
          }
        }, function(errorData) {
          $.notify(errorData.data.error);
          $('#loader').hide();
        });

      }
      else if (response.status === "NOT_AUTHENTICATED") {
        $('#loginMobileNumber').notify('Invalid OTP'); return;
      }
      else if (response.status === "BAD_PARAMS") {
        $('#loginMobileNumber').notify('Invalid OTP'); return;
      }
    }

    {/* phone form submission handler */}
    $scope.smsLogin = function() {
      var loginMobileNumber = $('#loginMobileNumber').val();
      if(loginMobileNumber != null) loginMobileNumber = loginMobileNumber.trim()
      if(loginMobileNumber == null || (loginMobileNumber != null && loginMobileNumber.length == 0)) {
        $('#loginMobileNumber').notify("Mobile Number Required!");
        return;
      }
      if(loginMobileNumber.length != 10) {
        $('#loginMobileNumber').notify("10 Digits Plz!");
        return;
      }
      if(!$rootScope.isAccountKitInitialized) $scope.initAccountKit();

      loginMobileNumber = loginMobileNumber.trim();
      $scope.mobileNumberToRegister = loginMobileNumber;
      var countryCode = "+91";
      AccountKit.login(
        'PHONE',
        {countryCode: countryCode, phoneNumber: loginMobileNumber}, // will use default values if not specified
        $scope.loginCallback
      );
    }


    {/* email form submission handler */}
    $scope.emailLogin = function() {
      var emailAddress = document.getElementById("email").value;
      AccountKit.login(
        'EMAIL',
        {emailAddress: emailAddress},
        loginCallback
      );
    }

  $scope.initAccountKit = function() {
    AccountKit.init({
      appId:"2285203685087284",
      state:"12345",
      version:"v3.0",
      fbAppEventsEnabled:true,
      redirect:"http://localhost:8181/"
    });
    $rootScope.isAccountKitInitialized = true;
  }

  $scope.editAddress = function(userAddress) {
    swal({
      content: {
        element: "input",
        attributes: {
          value: userAddress.address,
          type: "name",
        },
      },
    }).then(function(address) {
      if(address == null || (address != null && address.length < 10)) {
        return;
      }
      $('#loader').show();
      var request = new Object();
      request['address'] = address;
      request['addressId'] = userAddress.addressId;
      APIService.apiCall(APIEndPoints.editUserAddress, "POST", request).then(function(successData) {
        for(var i=0; i<$rootScope.userAddresses.length; i++) {
          if($rootScope.userAddresses[i].addressId === userAddress.addressId) {
            $rootScope.userAddresses[i].address = address;
            break;
          }
        }
        $('#loader').hide();
      }, function(errorData) {
        $rootScope.checkLoginStatus();
        $('#loader').hide();
      });
    });
  }

  $scope.emailInvoice = function(order, $event) {
    $('#loader').show();
    var URL = (APIEndPoints.emailInvoice + "?orderId=" + order.orderId);
    APIService.apiCall(URL, "GET", "").then(function(successData) {
      $('#loader').hide();
    }, function(errorData) {
      $rootScope.checkLoginStatus();
      $('#loader').hide();
    });
    $event.stopPropagation();
  }

  $scope.getMyOrders();
}]);
