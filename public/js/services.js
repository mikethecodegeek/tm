'use strict';

var app = angular.module('angularApp');

app.factory("authService", function(){
    return {
        getUser: function(){
            return $http.get('./api/users/profile');
        }
    };
});


app.service('userService', function($q,$http) {
    var profile = {loggedin: false};
    this.setProfile = function(myprofile) {
        profile = myprofile
    };
    this.getProfile =  function() {
        return $http.get('./api/users/profile');
    };
    this.getAll =  function(){
        return $http.get('./api/users');
    };

    this.getById = function(id) {
        return $http.get(`./api/users/id/${id}`);
    };

    this.getContacts = function() {
      return $http.get('./api/users/contacts');
    }

    this.getByUsername = function(username) {
        return $http.get(`./api/users/${username}`);
    }

    this.register = function (newPost){
       return $http.post('./api/users/register', {user: newPost});
    };

    this.deleteById = function(id) {
        return $http.delete(`./api/users/${id}`);
    };

    this.editById = function (id, newUser) {
        return $http.put(`./api/users/${id}`, {user: newUser});
    };

    this.login = function (user) {
        return $http.post('./api/users/login/', {email: user.email, password: user.password});
    };
    this.logout = function () {
        return $http.delete('./api/users/logout/');
    };

    this.admin = function () {
        return $http.get('./api/users/admin/');
    };
    this.adminPassword = function (user,newpass) {
        return $http.post('./api/users/admin/password',{user:user, password: newpass});
    };
    this.changeAdminEmail = function (user, newemail){
        return $http.post('./api/users/admin/changeemail',{user:user, email:newemail});
    };

});


app.service('landingService',function($http) {
    this.getAll = function (){
        return $http.get('./api/devicetypes');
    };
    this.addDeviceType = function (item) {
        return $http.post('./api/devicetypes/newdevice', {device: item}
        );
    };

    this.deleteById = function (id) {
        return $http.delete(`./api/devicetypes/${id}`);
    };

    this.editById = function (id, device) {
        return $http.put(`./api/devicetypes/${id}`,{device: device});
    };


});




app.service('messageService',function($http) {
    this.getAll = function () {
        return $http.get('./api/inbox');
    };
    this.sendToAdmin = function (newMessage) {
        return $http.post('./api/inbox/newmessage',{message: newMessage});
    };
    this.sendToUser = function (newMessage) {
        return $http.post('./api/inbox/user',{message: newMessage});
    };
    this.getAdmin = function (newMessage) {
        return $http.get('./api/inbox/adminbox',{message: newMessage});
    };
    this.getUser = function (user) {
        return $http.post('./api/inbox/userbox',{user: user});
    };

    this.emailAdmin = function (newMessage) {
        return $http.post('./api/mail/inquiry',{message: newMessage});
    };
    this.sendConfirm = function (newMessage) {
        return $http.post('./api/mail/sendmail',{user: newMessage});
    };
    this.deleteById = function (id) {
        return $http.delete(`./api/inbox/${id}`);
    };
    this.readById = function (id) {
        return $http.post(`./api/inbox/read`, {message: id});
    };
    this.editById = function (id, newPost) {
        return $http.put(`./api/inbox/${id}`, {item: newPost});
    }
});

app.service('listingService',function($http) {

    this.getItems = function(item) {
        return $http.get('./api/listings/');
    };
    this.getUserItems = function(item) {
        return $http.post('./api/listings/name',{name:item});
    };
    this.getTasks = function(item) {
        return $http.get('./api/listings/alltasks',{name:item});
    };
    this.newItem = function(item) {
        return $http.post('./api/listings/newlisting',{item:item});
    };
    this.deleteItem =  function(item) {
        return $http.post('./api/listings/deletelisting',{item:item});
    };
    this.updateItem = function(item) {
        return $http.post('./api/listings/updatelisting',{item:item});
    };

});
