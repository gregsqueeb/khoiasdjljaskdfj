var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: String,
    password: String,
    date: { type: Date, default: Date.now },
    admin: { type: Boolean, default: false },
    tags: { type: [String], default: [] }
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
