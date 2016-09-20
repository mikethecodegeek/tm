
'use strict';

var app = angular.module('angularApp', ['ui.router', 'satellizer', 'ngAnimate']);

app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('landing', {
            url: '/',
            templateUrl: '/html/landingpage.html',
            controller: 'landingCtrl'

        })

        .state('edituser', {
            url: '/users/edit/:userid',
            templateUrl: '/html/edituser.html',
            controller: 'editUserCtrl'
        })
        .state('loggedin', {
            url: '/',
            templateUrl: '/html/home.html',
            controller: 'mainCtrl'
        })
        .state('newlisting', {
            url: '/listing/new',
            templateUrl: '/html/newlisting.html',
            controller: 'newItemCtrl'
        })
        .state('login', {
            url: '/login/',
            templateUrl: '/html/login.html',
            controller: 'loginCtrl'
        })

        .state('register', {
            url: '/newuser/',
            templateUrl: '/html/register.html',
            controller: 'registerCtrl'
        })
        .state('settings', {
            url: '/admin/settings',
            templateUrl: '/html/settings.html',
            controller: 'settingsCtrl',
            resolve: {
                userLoggedIn: function(userService) {
                    return userService.admin()
                        .then( function(user)  {
                            return user
                        });
                }
            }
        })
        .state('users', {
            url: '/admin/users',
            templateUrl: '/html/manageUsers.html',
            controller: 'manageUsersCtrl',
            resolve: {
                userList: function(userService) {
                    return userService.getAll()
                        .then(function (users) {
                            return users
                        });
                }
            }
        })

        .state('dashboard', {
            url: '/admin/dashboard',
            templateUrl: '/html/dashboard.html',
            controller: 'dashboardCtrl',
            resolve: {
                userLoggedIn: function(userService) {
                    return userService.admin()
                        .then( function(user) {
                            return user
                        });
                }
            }
        })
        .state('inbox', {
            url: '/inbox',
            templateUrl: '/html/inbox.html',
            controller: 'inboxCtrl'
        })

        .state('profile', {
            url: '/profile/',
            templateUrl: '/html/profile.html',
            controller: 'profileCtlr'
        })
        .state('legal', {
            url: '/legal',
            templateUrl: '/html/legal.html'
        })
        .state('businesscontactform', {
            url: '/businesscontactform',
            templateUrl: '/html/businesscontactform.html',
            controller: 'businessCtlr'
        })
        .state('userupdate', {
            url: '/profile/update',
            templateUrl: '/html/edituserprofile.html',
            controller: 'userUpdateCtrl',
            resolve: {
                userLoggedIn: function(userService) {
                    return userService.getProfile()
                        .then(function (user) {
                            return user
                        });
                }
            }
        });


    $urlRouterProvider.otherwise('/');

})
