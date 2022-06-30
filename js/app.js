var app = angular.module("veggie-market", ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "items.html"
    })
    .when("/login", {
        templateUrl : "login.html",
        resolve: {
          factory: checkRouting
        }
    })
    .when("/register", {
        templateUrl : "register.html",
        resolve: {
          factory: checkRouting
        }
    })
    .when("/user-address", {
        templateUrl : "user-address.html",
        resolve: {
          factory: checkRouting
        }
    })
    .when("/account", {
        templateUrl : "my-account.html",
        resolve: {
          factory: checkRouting
        },
        controller: "user-controller"
    })
    .when("/cart", {
        templateUrl : "cart.html",
        resolve: {
          factory: checkRouting
        }
    })
    .when("/capture-user-details", {
        templateUrl : "capture-user-details.html"
    })
    .when("/privacy-policy", {
        templateUrl : "privacy-policy.html"
    })
    .when("/help", {
        templateUrl : "help.html",
        resolve: {
          factory: checkRouting
        },
        controller : "help-controller"
    })
    .otherwise({redirectTo: '/'});
});

var checkRouting= function ($q, $rootScope, $location) {
  if(!$rootScope.isMainApiCalled) {
    $rootScope.changeView('index');
  }
};

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};
