var express = require('express');
var router = express.Router();
var User = require('../models/user');
var request = require('request');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

router.get('/', (req,res)=> {
     User.find({})
        .exec((err, data) => err ? res.send(err) : res.send(data));
});

router.get('/contacts', (req,res)=> {
     User.find({admin:false})
        .exec((err, data) => err ? res.send(err) : res.send(data));
});

router.post('/register', (req,res) => {
    User.register(req.body, (err, thisuser)=> err ? res.status(400).send(err) : res.status(200).send(thisuser));
});

router.post('/registeradmin',User.auth('admin'), (req,res) => {
    User.registerAdmin(req.body, (err, thisuser)=> err ? res.status(400).send(err) : res.status(200).send(thisuser));
});
router.get('/profile', User.auth(), (req,res) => {
        res.status(200).send(req.user);
});

router.get('/admin', User.auth('admin'), (req,res) => {
    res.send(req.user);
});

router.post('/admin/password', User.auth('admin'), (req,res)=> {
    bcrypt.hash(req.body.password, 12, (err, hash) => {
        if(err) {
            console.log(err)
        } else  {
            User.findById(req.body.user._id, (err, dbUser) => {
                if(err) {
                    console.log(err);
                    res.send(err)
                }else {
                    dbUser.password = hash;
                    dbUser.save();
                    res.status(200).send();
                }

            });
        }
    });
});


router.post('/admin/changeemail', (req,res)=> {
    User.findByIdAndUpdate(req.body.user._id,{$set: {email: req.body.email}}, {new:true}, (err,data)=> {
        if (err){
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});


router.post('/login', (req,res) => {
    User.authenticate(req.body, (err, token) => err ? res.status(400).send(err) : res.cookie('accessToken', token).send(token));
});

router.delete('/logout', (req, res) => {
    res.clearCookie('accessToken').send();
});

router.get('/verify/:token', (req, res) => {
    var token = req.params.token;
    User.verify(token, err => err ? res.redirect('/#/verifyfail') :  res.redirect('/#/verifysuccess'));
});

router.post('/transactions/new', (req,res) => {
    console.log('transactions body: ',req.body)
    userId=req.body.user.data._id;
    User.findById(userId, (err,user) => {
        if (err) {
            console.log(err);
        }
        else {
            user.transactions.push(req.body.transaction._id);
            user.save();
            res.send(user);
        }
    });
});

router.get('/:username', (req,res)=> {
    User.findOne({ 'username': req.params.username })
        .exec((err,data) => err ? res.send(err) : res.send(data));
});

router.get('/id/:id', (req,res)=> {
    console.log('params:',req.params)
    User.findById(req.params.id)
        .populate('transactions')
    .exec((err,data) => err ? res.send(err) : res.send(data));
});


router.delete('/:id', (req,res)=> {
    User.findByIdAndRemove(req.params.id, (err,data)=> {
        if (err){
            console.log(err);
        }
        else {
            User.find({})
                .exec((err, data) => err ? res.send(err) : res.send(data));
        }
    });
});

router.put('/:id', (req,res)=> {
    User.findByIdAndUpdate(req.params.id,{$set: req.body.user}, {new:true}, (err,data)=> {
        if (err){
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});




module.exports = router;
