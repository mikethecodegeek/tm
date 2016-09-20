var express = require('express');
var path = require('path');
var router = express.Router();
var request = require('request');
var http = require('http');
var sendgrid = require('sendgrid')('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');
var User = require('../models/user');
var Email = require('../models/emails');
var alertAdmin = require('../config/mail')
var app = express();


router.post('/sendtask/', function(req,res) {
 console.log(req.body)
    Email.findOne({status:"confirm"})
        .exec((err, admin) => {
            if (err) {
                console.log(err)
                res.send(err);
            }
            else {
                var data = {
                    from: "Eddie",
                    to: req.body.user.email,
                    subject: "You have a new task",
                    html: "Please check your tasks"
                }

                sendgrid.send(data, function (err, body) {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        User.findOne({superadmin:true})
                            .exec((err, admin) => {
                                if (err) {
                                    res.send(err);
                                }
                                else {
                                    alertAdmin(admin.email, function (err, body) {
                                        if (err) {
                                            console.log(err)
                                            res.send(err);
                                        }
                                        else {
                                            res.send('submitted');
                                        }
                                    });



                                }

                            });
                    }
                });
             }
        });
});

router.post('/adminalert/', function(req,res) {

    User.findOne({superadmin:true})
        .exec((err, admin) => {
            if (err) {
                console.log(err)
                res.send(err);
            }
            else {
                alertAdmin(admin.email,(err, body) => err ? res.send(err) : res.send(body));
            }
        });
});


router.put('/:id', (req,res)=> {
    Email.findByIdAndUpdate({status: 'confirm'},{$set: req.body.item}, {new:true}, (err,data)=> {
        if (err){
            res.send(err);
        }
        else {
            res.send(data);
        }
    });
});



module.exports = router;
