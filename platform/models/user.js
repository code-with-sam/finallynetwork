var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    user: String,
    theme: String,
    beta: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);
