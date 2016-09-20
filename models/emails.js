var mongoose = require('mongoose');

var emailSchema = new mongoose.Schema({
    status: {type: String},
    sentfrom: {type: String},
    subject: { type: String },
    body: {type: String}
});


var Emails = mongoose.model('Emails', emailSchema);

module.exports = Emails;
