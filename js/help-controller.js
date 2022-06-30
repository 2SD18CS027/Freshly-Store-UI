app.controller("help-controller", ["$http", "$scope", "$rootScope", "$window", "APIService", function($http, $scope, $rootScope, $window, APIService) {
  $scope.displayedAnswer = [];
  APIService.apiCall("../js/faqs.json", "GET", "").then(function(successData) {
    console.log(successData);
    $scope.faqs = successData.data.faqs;
  }, function(errorData) {
    $rootScope.checkLoginStatus();
  });

  $scope.showHideAnswer = function(faq) {
    if($scope.displayedAnswer.includes(faq.id)) {
      for(var i=0; i<$scope.displayedAnswer.length; i++) {
        if($scope.displayedAnswer[i] === faq.id) {
          $scope.displayedAnswer.splice(i,1);
          break;
        }
      }
      $('#faqanswer-' + faq.id).hide(100);
    } else {
      $scope.displayedAnswer.push(faq.id);
      $('#faqanswer-' + faq.id).show(100);
    }
  }

  $scope.isDisplay = function(id) {
    return $scope.displayedAnswer.includes(id);
  }
}]);
