const mongoose = require('mongoose');
const sanitizeHtml = require('sanitize-html');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        minLength: 4,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    isEmailPrivate: {type: Boolean, default: true},
    profilePicture: String,
    coverPicture: String,
    bio: {type: String, trim: true},
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

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_STRING, { expiresIn: '1 day' });
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}

 userSchema.methods.toJSON = function () {
     const user = this;
     const userObject = user.toObject();
     delete userObject.password;
     delete userObject.tokens;

     return userObject;
 }

module.exports = mongoose.model('User', userSchema);