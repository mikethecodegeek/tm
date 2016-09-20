var mongoose = require('mongoose');

var listingSchema = new mongoose.Schema({
    assignee:{type: String},
    assignor: {type: String},
    date: {type: String},
    name: {type: String},
    type:{type: String},
    desc:{type: String},
    priority:{type: String},
    status:{type: String, default: 'New'}
});


var Listings = mongoose.model('Listings', listingSchema);

module.exports = Listings;
