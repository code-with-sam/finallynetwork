var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    user: String,
    theme: String,
    beta: Boolean,
    test: Boolean
});

module.exports = mongoose.model('User', userSchema);
