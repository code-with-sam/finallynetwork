var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    user: { type: String, unique: true },
    theme: String,
    beta: { type: Boolean, default: false },
    tag: { type: String, default: '' },
    navigation: { type: [String], default: []},
    showResteems: {type: Boolean, default: false}
});

module.exports = mongoose.model('User', userSchema);
