app.factory("APIService", ["$http", "$q", function($http, $q){
    return {
    apiCall : function(api,type,data) {
      var token = readCookie("the-freshly-store-admin-cookie");

      deferred = $q.defer();
      $http({
          url:api,
          method:type,
          headers: {
              'Content-Type': "application/json",
              'token': token,
              'deviceTypeId' : 1,
              'secretToken' : '1dc7c76c-7d6d-49f0-b67d-5c4899aab02a'
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
