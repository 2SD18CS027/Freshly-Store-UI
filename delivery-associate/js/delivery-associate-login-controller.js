app.controller("delivery-associate-login-controller", ["$http", "$scope", "$rootScope", "$window", "APIService", function($http, $scope, $rootScope, $window, APIService) {
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
      $('#loginPassword').notify("Password Required!");
      return;
    }
    if(loginPassword.length <= 5) {
      $('#loginPassword').notify("Minimum 6 characters!");
      return;
    }

    $('#loader').show();
    var request = new Object();
    request['mobileNumber'] = loginMobileNumber;
    request['password'] = loginPassword;
    APIService.apiCall(APIEndPoints.deliveryAssociateLogin, "POST", request).then(function(successData) {
      var now = new Date();
      var time = now.getTime();
      var expireTime = time + (24 * 60 * 60 * 1000);
      now.setTime(expireTime);
      document.cookie = "the-freshly-store-delivery-associate-cookie=" + successData.data.token + ";expires=" + now.toGMTString();
      $('#loader').hide();
      $scope.changeView('index');
    }, function(errorData) {
      console.log(errorData);
      $('#loader').hide();
      $scope.changeView('login');
    });
  }
}]);
