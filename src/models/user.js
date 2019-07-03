const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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
    tokens: [{
        token: {
            type: String,
            trim: true
        }
    }]
});

userSchema.static.compareCredentials = async (username, password) => {
    try{
        const user = await User.findOne({ username });
        if(!user){
            throw new Error('Error with login! Please check your username/password!');
        }

        const isCorrectUser = await bcrypt.compare(user.password, password);
        if(!isCorrectUser){
            throw new Error('Error with login! Please check your username/password!');
        }

        //if both succeed then generate a token for the user logging in
    }catch(e){

    }
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

