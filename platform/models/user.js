var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    user: String,
    theme: String
});

module.exports = mongoose.model('User', userSchema);
