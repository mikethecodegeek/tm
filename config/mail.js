var request = require('request');
var mailgun = require('mailgun-js')({api_key :'key-e19319aa0140407c4ee483deb052f60c', domain: 'mg.michaelsanford.tech'});

var alertAdmin = function (adminemail, cb) {
    console.log(adminemail);
    var data = {
        from: 'Luxe TMS',
        to: 'mike@luxevh.com',
        subject: 'You have a new message',
        html: 'Please login to your TMS dashboard to view your messages'
    }

    mailgun.messages().send(data, (err, body) => err ? cb(err) : cb(null,body));
}

module.exports = alertAdmin;
