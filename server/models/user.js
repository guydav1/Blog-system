const mongoose = require('mongoose');
const sanitizeHtml = require('sanitize-html');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

})
// statics accessable through models and methods are accessable on instances
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_STRING, { expiresIn: '1 day' });
    user.tokens = user.tokens.concat({token})
    await user.save();  
    return token;
}

userSchema.methods.toJson = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

module.exports = mongoose.model('User', userSchema);