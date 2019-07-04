const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validateEmail } = require('../utils/utils');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        max: 20
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        validate: {
            validator: function(value){
                return validateEmail(value);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    bio: {
        type:String,
        trim: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'poster'
});

userSchema.static.compareCredentials = async (username, password) => {
    const user = await User.findOne({ username });
    if(!user){
        throw new Error('Error with login! Please check your username/password!');
    }

    const isCorrectUser = await bcrypt.compare(user.password, password);
    if(!isCorrectUser){
        throw new Error('Error with login! Please check your username/password!');
    }

    return user;
};

userSchema.methods.generateAuthToken = async function(){
    const user = this;

    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({ token });
    
    await user.save();

    return token;
};

userSchema.pre('save', async function(next){
    const user = this;

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;

