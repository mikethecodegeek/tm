'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var moment = require('moment');
var jwt = require('jsonwebtoken');
var Schema = mongoose.Schema;
var JWT_SECRET = process.env.JWT_SECRET || 'assasadsasadfsadf';

var userSchema = new mongoose.Schema({
    name: {type: String},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    messages: { type: Array },
    admin: {type: Boolean, default: false}
});


userSchema.statics.auth = role => {
    return function (req,res,next) {
        var token = req.cookies.accessToken;
        jwt.verify(token, JWT_SECRET, (err, payload) => {
            if(err){
                return res.status(401).send({error: 'Authentication required.'});
            }
            User.findById(payload._id)
                .populate('transactions')
                .select('-password')
            .exec((err, user) => {
                if(err || !user) return res.status(401).send({error: 'User not found.'});
                req.user = user;
                if(role === 'admin' && !req.user.admin) {
                    return res.status(403).send({error: 'Not authorized.'});
                }
                next();
            });
        });
    };
};


userSchema.statics.register = (userObj, cb) => {
    console.log(userObj)
    User.findOne({email: userObj.user.email}, (err, dbUser) => {
        if (err || dbUser) return cb({error: 'Email not available.'});
        User.findOne({name: userObj.user.name}, (err, dbUser) => {
            if (err || dbUser) return cb({error: 'Username not available.'});
            var user;
            bcrypt.hash(userObj.user.password, 12, (err, hash) => {
                console.log('err', err);
                if (err) return cb(err);
                if (userObj.user.authType === 'user') {
                    user = new User({
                        name: userObj.user.name,
                        email: userObj.user.email,
                        password: hash,
                        messages: []
                    });
                }
                user.save((err, savedUser) => {
                    console.log('err:', err)
                    savedUser.password = null;
                    cb(err, savedUser);
                });
            });
        });
    });
};

userSchema.statics.authenticate = (userObj, cb) => {
    User.findOne({email: userObj.email}, (err, dbUser) => {
        if(err || !dbUser) return cb(err || { error: 'Authentication failed.  Invalid email or password.' });

        bcrypt.compare(userObj.password, dbUser.password, (err, isGood) => {
            if(err || !isGood) return cb(err || { error: 'Authentication failed.  Invalid email or password.' });

            var token = dbUser.generateToken();

            cb(null, token);
        });
    });
};

userSchema.methods.getCurrentUser = function() {
    User.findById(userId, (err, user, cb) => {
        return cb(user);
    });
};
userSchema.methods.generateToken = function() {
    var payload = {
        _id: this._id,
        exp: moment().add(1, 'day').unix()
    };

    return jwt.sign(payload, JWT_SECRET);
};

userSchema.statics.verify = (token, cb) => {
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) return cb(err);

        User.findById(payload._id, (err, user) => {
            if (err || !user) return cb(err || 'User not found.');
            user.verified = true;
            user.save(cb);
        });
    });
};
var User = mongoose.model('User', userSchema);

module.exports = User;
