var app = angular.module("the-freshly-store-admin", ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
    .when("/login", {
        templateUrl : "login.html",
        controller: "login-controller"
    })
    .when("/items", {
        templateUrl : "items.html",
        controller: "items-controller"
    })
    //.otherwise({redirectTo: '/'});
});

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
