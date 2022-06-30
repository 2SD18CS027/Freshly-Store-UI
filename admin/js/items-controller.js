app.controller("items-controller", ["$http", "$scope", "$rootScope", "$window", "APIService", function($http, $scope, $rootScope, $window, APIService) {

  $scope.main = function() {
    $('#loader').show();
    APIService.apiCall(APIEndPoints.getAllItems, "GET", "").then(function(successData) {
      console.log(successData.data);
      $scope.items = successData.data.items;
      $rootScope.activeTab = 'items';
      $('#loader').hide();
    }, function(errorData) {
      console.log(errorData);
      $('#loader').hide();
      if(errorData.status == 401)
        $scope.changeView('login');
    });
  }

  $scope.changeItemStatus = function(item) {
    $('#loader').show();
    var request = new Object();
    request['itemId'] = item.itemId;
    request['isAvailable'] = !(item.isAvailable);
    APIService.apiCall(APIEndPoints.editItem, "POST", request).then(function(successData) {
      item.isAvailable = !(item.isAvailable)
      $('#loader').hide();
    }, function(errorData) {
      $('#loader').hide();
      if(errorData.status == 401)
        $scope.changeView('login');
    });
  }

  $scope.editPrice = function(item) {
    swal({
      content: {
        element: "input",
        attributes: {
          type: "name",
          value: item.price,
        },
      },
    }).then(function(value) {
      if(value == null) return;
      if(value.length == "") return;
      $('#loader').show();
      value = parseInt(value);
      var request = new Object();
      request['price'] = value;
      request['itemId'] = item.itemId;
      APIService.apiCall(APIEndPoints.editItem, "POST", request).then(function(successData) {
        item.price = value;
        $('#loader').hide();
      }, function(errorData) {
        $('#loader').hide();
        $rootScope.checkLoginStatus();
      });
    });
  }

  $scope.changeItemImage = function(item) {
    $('#loader').show();
    var form = new FormData();
    form.append("image", document.getElementById('imageUpload-' + item.itemId).files[0]);

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": APIEndPoints.imageupload,
      "method": "POST",
      "headers": {
        "Content-Type": undefined,
        "secretToken": "1dc7c76c-7d6d-49f0-b67d-5c4899aab02a",
        "token": readCookie("the-freshly-store-admin-cookie"),
        "imageUploadClientSecret" : "bf3e1b13b12644dea16ab60824e2eb75"
      },
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form
    }

    $.ajax(settings).done(function (response) {
      response = JSON.parse(response);
      console.log(response.url);
      var request = new Object();
      request['imageUrl'] = response.url;
      request['itemId'] = item.itemId;
      console.log(request);
      APIService.apiCall(APIEndPoints.editItem, "POST", request).then(function(successData) {
        item.imageUrl = response.url;
        $('#loader').hide();
      }, function(errorData) {
        $('#loader').hide();
        $rootScope.checkLoginStatus();
      });
    });
  }

  $scope.addItem = function() {
    swal({
      content: "input",
    }).then(function(value) {
      if(value == null || (value != null && value.length < 3)) return;
      $('#loader').show();
      var request = new Object();
      request['imageUrl'] = "https://the-freshly-store-icons.s3.amazonaws.com/c2421da8-635c-4755-b63e-8d690a8e132a1548587099190.png";
      request['price'] = 10.0;
      request['category'] = "Fresh Vegetables";
      request['uom'] = 'Kg';
      request['name'] = value;

      APIService.apiCall(APIEndPoints.addItem, "POST", request).then(function(successData) {
        request['itemId'] = successData.data.itemId;
        console.log(request);
        $scope.items.push( request );
        $('#loader').hide();
      }, function(errorData) {
        $('#loader').hide();
        $rootScope.checkLoginStatus();
      });

    })
  }

  $scope.changeCatergory = function(item) {
    $('#loader').show();
    var request = new Object();
    if(item.category === 'Fresh Vegetables') {
      request['category'] = "Fresh Fruits";
    } else {
      request['category'] = "Fresh Vegetables";
    }
    request['itemId'] = item.itemId;

    APIService.apiCall(APIEndPoints.editItem, "POST", request).then(function(successData) {
      if(item.category === 'Fresh Vegetables') {
        item.category = "Fresh Fruits";
      } else {
        item.category = "Fresh Vegetables";
      }
      $('#loader').hide();
    }, function(errorData) {
      $('#loader').hide();
      $rootScope.checkLoginStatus();
    });
  }
  $scope.changePassword = function() {
    var newPassword = document.getElementById("newPasswordInput").value;
    $('#loader').show();
    var request = new Object();
    request['password'] = newPassword;

    APIService.apiCall(APIEndPoints.changePassword, "POST", request).then(function(successData) {
      swal({
        title: "New Settings Applied!",
        icon: "success"
      }).then(function(isConfirm) {
        $('#loader').hide();
      });

      $('#loader').hide();
    }, function(errorData) {
      $('#loader').hide();
    });

    $('#loader').hide();
  } 

  $scope.changeUom = function(item) {
    $('#loader').show();
    var request = new Object();
    if(item.uom === 'Piece') {
      request['uom'] = "Kg";
    } else {
      request['uom'] = "Piece";
    }
    request['itemId'] = item.itemId;

    APIService.apiCall(APIEndPoints.editItem, "POST", request).then(function(successData) {
      if(item.uom === 'Piece') {
        item.uom = "Kg";
      } else {
        item.uom = "Piece";
      }
      $('#loader').hide();
    }, function(errorData) {
      $('#loader').hide();
      $rootScope.checkLoginStatus();
    });
  }

  $scope.main();
}]);
