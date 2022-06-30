app.controller("login-controller", ["$http", "$scope", "$rootScope", "$window", "APIService", function($http, $scope, $rootScope, $window, APIService) {
  $scope.adminLogin = function() {
    var username = $('#username').val();
    var password = $('#password').val();
    if(username == null || (username != null && username.length == 0)) {
      $('#username').notify('Required!');
      return;
    }
    if(password == null || (password != null && password.length == 0)) {
      $('#password').notify('Required!');
      return;
    }

    $('#loader').show();
    var request = new Object();
    request['username'] = username;
    request['password'] = password;
    APIService.apiCall(APIEndPoints.adminLogin, "POST", request).then(function(successData) {
      console.log(successData);
      var now = new Date();
      var time = now.getTime();
      var expireTime = time + (24 * 60 * 60 * 1000);
      now.setTime(expireTime);
      document.cookie = "the-freshly-store-admin-cookie=" + successData.data.token + ";expires=" + now.toGMTString();
      $('#loader').hide();
      $scope.changeView('items');
    }, function(errorData) {
      $('#loader').hide();
      $('#password').notify(errorData.data.error);
    });
  }
}]);
