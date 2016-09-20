var mongoose = require('mongoose');

var messageSchema = new mongoose.Schema({
    message: {type: String},
    to: {type: String},
    from: {type: String},
    subject: {type: String}
});


var Messages = mongoose.model('Messages', messageSchema);

module.exports = Messages;
