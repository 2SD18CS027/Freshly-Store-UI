app.factory("APIService", ["$http", "$q", function($http, $q){
    return {
    apiCall : function(api,type,data) {
      var token = readCookie("the-freshly-store-cookie");
      //alert(token);

      deferred = $q.defer();
      $http({
          url:api,
          method:type,
          headers: {
              'Content-Type': "application/json",
              'token': token,
              'deviceTypeId' : 1
          },
          data: JSON.stringify(data),
      }).then(function(successData) {
          deferred.resolve(successData);;
      }, function(errorData) {
          deferred.reject(errorData);
      });
      return deferred.promise;
    }
}
}]);
