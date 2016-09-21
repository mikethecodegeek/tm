var mongoose = require('mongoose');

var messageSchema = new mongoose.Schema({
    message: {type: String},
    to: {type: String},
    from: {type: String},
    subject: {type: String},
    date: {type: String},
    status:{type: String, default: "New"}
});


var Messages = mongoose.model('Messages', messageSchema);

module.exports = Messages;
