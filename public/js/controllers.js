'use strict';
var app = angular.module('angularApp');


app.controller('mainCtrl', function ($scope, $rootScope,  $state,  $window, $location, userService) {
  $rootScope.$on('$stateChangeStart', function() { $window.scrollTo(0,0) });

  $scope.isActive = function(viewLocation) {
       return viewLocation === $location.path();
   };

    var currentUser = userService.getProfile()
        .then( function(user) {
            if(user) {
                $rootScope.loggedin=true;
                if (user.data.admin === true) {
                    $scope.admin = true;
                }
                else {
                    $scope.admin = false;
                }
            }
            else {$rootScope.loggedin = false; }

        });

    $scope.logout = function () {
        userService.logout()
            .then( function(user) {
                  $rootScope.loggedin = false;
                  $scope.admin = false;
                  $scope.dash = false;
                $state.go('landing');
            });
    };

    $scope.loginUser=function() {
        $('#myModal').modal('show');
    };

    $scope.login = function() {
        var thisuser = {
            email: $scope.email,
            password: $scope.password
        };
        userService.login(thisuser)
            .then( function(user) {
                userService.setProfile(user);
                $state.go('landing');
            })
            .then( function() {
                $rootScope.loggedin=true;
                $('#email').val('');
                $('#password').val('');
                $('#myModal').modal('hide');
                userService.getProfile()
                    .then( function(user){

                      // console.log('Stuff')
                      // if (user.data.admin) {
                      //     $scope.admin = true;
                      // }
                      if (user.data.admin === true) {
                        $scope.dash = true;
                      }
                      else {
                        $scope.dash = false;
                      }

                    });
            }, function() {swal('Please be sure you are registered and use a valid email and password.')});
    };


});


app.controller('homeCtrl', function(userService, $stateParams, $scope, $state) {

});


app.controller('newListing', function(listingService, $scope, $state) {
    console.log('listing Ctrl');

});


app.controller('landingCtrl', function(userService, landingService, $scope, $state) {
//console.log(devices);
var currentUser = userService.getProfile()
    .then(function(user) {
      console.log(user)
      if (user.data.admin === true) {
        $scope.dash = true;
      }
      else {
        $scope.dash = false;
      }
      //$scope.messages= user.data.messages
    });


});

app.controller('sellCtrl', function(landingService, $scope, $state, devices) {

});

app.controller('settingsCtrl', function(messageService, $scope, $state, userLoggedIn, userService) {
    console.log(userLoggedIn);
    $scope.role = userLoggedIn.data.superadmin;
    $scope.email = userLoggedIn.data.email;
    messageService.getTemplate()
        .then( function(message) {
            console.log('template: ',message)
        $scope.primaryEmail = message.data.sentfrom;
            $scope.firstSubject = message.data.subject;
            $scope.firstEmail = message.data.body;
    })
    $scope.changePassword = function() {
        //console.log($scope.password)
        if ($scope.newpassword === $scope.confirmPassword) {
            var currentUser = userLoggedIn.data;
            var newpass = $scope.newpassword;
            userService.adminPassword(currentUser, newpass)
                .then( function(data) {
                    swal('Your password has been succesfully changed!')
                });
        }
        else {
            swal('Passwords do not match! Please try again');
        }

    };
    $scope.changeEmail = function() {
        var currentUser = userLoggedIn.data;
        var newemail=$scope.email;
        userService.changeAdminEmail(currentUser, newemail)
            .then( function(data) {
                console.log(data);
                swal('Your email has been succesfully changed!')
            });
    };
    $scope.registerAdmin = function() {
       var newAdmin = {
           name: $scope.newAdminName,
           email: $scope.newAdminEmail,
           username: $scope.newAdminUser,
           password: $scope.newAdminPassword,
           admin: true,
           authType: "admin"
       };

       if ($scope.newAdminPassword === $scope.newAdminConfirmPassword) {
           //console.log('hello')
           userService.register(newAdmin)
               .then( function(data) {
                   console.log(data);
                   swal('New admin registered')
               });
       }
   };


});

app.controller('manageUsersCtrl', function($scope, $state, userList, userService) {

    $scope.userArr = userList.data;
    //console.log(userList);
    $scope.deleteUser= function(selectedUser) {
        swal({ title: "Are you sure?",
                text: "User will be deleted from system!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false },
            function() {
                userService.deleteById(selectedUser)
                    .then(function(users) {
                        swal("Deleted!", "User has been deleted.",
                            "success");
                        $scope.userArr = users.data;
                    })
            }
        );
    }

});

app.controller('dashboardCtrl', function($scope, $state, userLoggedIn) {
 //   console.log('dash Control')
    if (userLoggedIn){
     //   console.log(userLoggedIn);
    }
    else {
        console.log('Not Logged In');
        $state.go('home');
    }
    var contacts = userService.getContacts()
    .then(function (contacts) {
      console.log('contacts', contacts)
      $scope.contacts = contacts.data;
    })


});

app.controller('inboxCtrl', function(userService, messageService, $scope, $state) {
  var authenticated, thisuser, contacts;
  var currentUser = userService.getProfile()
      .then(function(user) {
        console.log(user)
        thisuser= user.data.name;
        if (user.data.admin == true) {
          authenticated = true;
          $scope.authenticated = true;
          messageService.getAdmin()
          .then(function(messages){
            console.log(messages)
            $scope.messages = messages.data
          })
        }
        else {
          authenticated = false;
          $scope.authenticated = false;
          messageService.getUser(user.data.name)
          .then(function(messages){
            $scope.messages = messages.data
          })
        }

      });
    var contacts = userService.getContacts()
    .then(function (contacts) {
      console.log('contacts', contacts)
      $scope.contacts = contacts.data;
    })
    $scope.sendToAdmin = function(message) {
      message.to = "admin";
      message.date = moment()._d;
      message.from = thisuser;
      console.log(message)
      messageService.sendToAdmin(message)
      .then(function() {
        swal("Message Sent")
      })
    }
    $scope.sendToUser= function(message) {
      //message.to = "admin";
      message.from = "Eddie";
      message.date = moment()._d;
      console.log(message)
      messageService.sendToAdmin(message)
      .then(function() {
        swal("Message Sent")
      })
    }
    // messageService.getAll()
    //     .then(stuff => {
    //         $scope.messages = stuff.data;
    //     });
    $scope.deleteMessage = function(message) {
        console.log(message);
        messageService.deleteById(message)
            .then( function(stuff) {
                console.log(stuff)
                if (authenticated) {
                  messageService.getAdmin()
                  .then(function(messages){
                    console.log(messages)
                    $scope.messages = messages.data
                  })
                }
                else {
                  messageService.getUser(thisuser)
                  .then(function(messages){
                    $scope.messages = messages.data
                  })
                }
            });
    }

    $scope.readMessage = function(message) {
        console.log(message);
        messageService.readById(message)
            .then( function(stuff) {
                console.log(stuff)
                if (authenticated) {
                  messageService.getAdmin()
                  .then(function(messages){
                    console.log(messages)
                    $scope.messages = messages.data
                  })
                }
                else {
                  messageService.getUser(thisuser)
                  .then(function(messages){
                    $scope.messages = messages.data
                  })
                }
            });
    }


});

app.controller('dashboardCtrl', function($scope, $state, userService, listingService) {

  $(document).ready(function(){
    var date_input=$('input[name="date"]'); //our date input has the name "date"
    var container=$('.bootstrap-iso form').length>0 ? $('.bootstrap-iso form').parent() : "body";
    var options={
      format: 'mm/dd/yyyy',
      container: container,
      todayHighlight: true,
      autoclose: true,
    };
    date_input.datepicker(options);
  })

  listingService.getTasks()
  .then( function(items){
    console.log(items)
      $scope.items= items.data;
  })

  $scope.edit = function(item) {
    $scope.selected = item;
    $('#adminModal').modal('show')
  }

  $scope.delete = function (item) {
    listingService.deleteItem(item)
    .then( function(items) {
      listingService.getTasks()
      .then( function(items){
          $scope.items= items.data;
          //$('#myModal6').modal('hide');
      })
    })
  }

  $scope.updateList = function (item) {
    console.log('item', item)
    item.duedate = $('#picked').val()
    item.assignor ="Eddie";
    item.assignee = item.name;
    item.date = moment()._d;
    listingService.newItem(item)
    .then( function(item) {
      listingService.getTasks()
      .then(function(items){
          $scope.items= items.data;
          $('#adminModal').modal('hide');
      })
    })
  }

  var contacts = userService.getContacts()
  .then(function (contacts) {
    console.log('contacts', contacts)
    $scope.contacts = contacts.data;
  })

  $scope.addToList = function(item) {
      console.log(item)
      //item.date = moment()._d;
      item.duedate = $('#pickedNew').val()
      item.assignor ="Eddie";
      item.assignee = item.name;
      item.date = moment()._d;
      listingService.newItem(item)
      .then( function(items) {
        console.log(item);
        listingService.getTasks()
        .then( function(items){
            console.log(items)
            $scope.items= items.data;
            $('#dashModal').modal('hide');
            $scope.selected1 = {};
        })
      })
    }

    $scope.edit = function(item) {
    $scope.selected = item;
    $('#adminUpdate').modal('show')
    }

    $scope.updateList = function (item) {
      item.duedate = $('#picked2').val()
      item.assignor ="Eddie";
      item.assignee = item.name;
      item.date = moment()._d;
      listingService.updateItem(item)
      .then( function(item) {
        listingService.getTasks()
        .then(function(items){
            $scope.items= items.data;
            $('#adminUpdate').modal('hide');
        })
      })
    }

});


app.controller('userUpdateCtrl', function(userLoggedIn, userService, $scope, $state, $auth) {
    console.log(userLoggedIn)
    $scope.userToEdit = userLoggedIn.data;

    $scope.updateUser = function() {
        var updateduser = {
            name: $('#newname').val(),
            email: $('#newemail').val()

        };
        console.log(updateduser)
        userService.editById($scope.userToEdit._id, updateduser)
            .then( function(user) {
                swal('Thanks! Your information has updated successfully.')
            })

    }
});

app.controller('loginCtrl', function(userService, $scope, $state, $auth) {
    $scope.login = function() {
        var thisuser = {
            email: $scope.email,
            password: $scope.password
        };
        userService.login(thisuser)
            .then( function(stuff) {
                userService.setProfile(stuff);
                $state.go('home');
            });
    }

});


app.controller('editUserCtrl', function(userService, $scope, $state, $auth) {
    console.log($state.params.userid);
     userService.getById($state.params.userid)
         .then( function(userToEdit) {
             console.log('userToEdit:', userToEdit);
             $scope.userToEdit = userToEdit.data;
         });
     $scope.updateUser = function() {
         var updateduser = {
             name: $('#newname').val(),
             email: $('#newemail').val(),
             phone: $('#newphone').val(),
         };
         console.log(updateduser)
         userService.editById($scope.userToEdit._id, updateduser)
             .then( function(user) {
                 swal('User updated successfully')
             })
     }
});

app.controller('registerCtrl', function(userService, $scope, $rootScope, $state) {
    $scope.register = function(form) {
       // // console.log(form)
        var re;
        if($scope.pwd1 != "" && $scope.pwd1 == $scope.pwd2) {
            if($scope.pwd1.length < 6) {
                swal("Error: Password must contain at least six characters!");
                return false;
            }
            if($scope.pwd1 == $scope.username) {
                swal("Error: Password must be different from Username!");
                return false;
            }
            re = /[0-9]/;
            if(!re.test($scope.pwd1)) {
                swal("Error: password must contain at least one number (0-9)!");
                return false;
            }
            re = /[a-z]/;
            if(!re.test($scope.pwd1)) {
                swal("Error: password must contain at least one lowercase letter (a-z)!");
                return false;
            }
            re = /[A-Z]/;
            if(!re.test($scope.pwd1)) {
                swal("Error: password must contain at least one uppercase letter (A-Z)!");
                return false;
            }
        } else {
            swal("Error: Please check that you've entered and confirmed your password!");
            return false;
        }


        var thisuser = {
            name: $scope.newName,
            email: $scope.newEmail,
            password: $('#pwd1').val()
        };
        thisuser.joinDate = moment().format();
        thisuser.authType = 'user';
     //   console.log(thisuser);
        var user = {
            data: thisuser
        };
        userService.register(thisuser)
            //console.log(thisuser)
            .then( function(newuser) {
                console.log(newuser)


                    swal({
                            title: "Thank You for registering", text: ``,
                            type: "success", closeOnConfirm: true
                        }
                    );

                var thisuser = {
                    email: $scope.newEmail,
                    password: $('#pwd1').val()
                };
                console.log(thisuser)
                userService.login(thisuser)
                    .then( function(user) {
                        userService.setProfile(user);
                        //$state.go('landing');
                    })
                    .then( function(stuff) {
                    $rootScope.loggedin=true;
                userService.getProfile()
                    .then( function(user){
                        if (user.data.admin) {
                            $scope.admin = true;
                        }
                        $state.go('profile')
                    });
                })


            }, function(err){
                console.log(err)
                swal(err.data.error)});
    }

});
app.controller('profileCtlr', function(listingService, userService, $scope, $state, messageService) {
    var thisuser;
    var currentUser = userService.getProfile()
    .then( function(user) {
      thisuser=user;
      console.log(thisuser)

      listingService.getUserItems(user.data.name)
        .then( function(items){
          console.log(items)
          $scope.items= items.data;
        })


    });
    $scope.addToList = function(item) {
      console.log(item)
      console.log(thisuser)
      item.date = moment()._d;
      item.assignor = thisuser.data.name;
      item.assignee = thisuser.data.name;
      listingService.newItem(item)
      .then( function(items) {
        console.log(item);
        listingService.getUserItems(thisuser.data.name)
        .then( function(items){
            console.log(items)
            $scope.items= items.data;
            $('#myModal6').modal('hide');
        })
      })
    }

    $scope.edit = function(item) {
    $scope.selected = item;
    $('#adminModal').modal('show')
  }

  $scope.starttask =function(task) {
    console.log(task)
    task.startdate = moment()._d;
    listingService.startTask(task)
    .then( function(items) {
      listingService.getUserItems(thisuser.data.name)
      .then( function(items){
          $scope.items= items.data;
          //$('#myModal6').modal('hide');
      })
    })
  }

  $scope.completetask = function(task) {
    task.completedate = moment()._d;
    console.log(task)
    listingService.completeTask(task)
    .then( function(items) {
      listingService.getUserItems(thisuser.data.name)
      .then( function(items){
          $scope.items= items.data;
          //$('#myModal6').modal('hide');
      })
    })
  }

  $scope.delete = function (item) {
    listingService.deleteItem(item)
    .then( function(items) {
      listingService.getUserItems(thisuser.data.name)
      .then( function(items){
          $scope.items= items.data;
          //$('#myModal6').modal('hide');
      })
    })
  }

  $scope.updateList = function (item) {
    listingService.updateItem(item)
    .then( function(item) {
      listingService.getUserItems(thisuser.data.name)
      .then(function(items){
          $scope.items= items.data;
          $('#adminModal').modal('hide');
      })
    })
  }
    //console.log('stuff');
    $scope.askAQuestion = function() {
        var userMessage = {
            message: $scope.newMessage,
            user: $scope.user
        }
        var email = {
            useremail: $scope.user.email,
            emailbody: $scope.newMessage
        }
    //    console.log(userMessage);
        messageService.sendToAdmin(userMessage);
        messageService.emailAdmin(email)
            .then( function(message) {console.log(message)})
                $scope.newMessage = "";
                swal({   title: "Thank You!",   text: `We will get back to you within 24 hours.`,
                                         type: "success",  closeOnConfirm: true }
                                     );

    }
  // console.log($scope.user.email)





    });
