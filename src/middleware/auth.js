const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (res, req, next) => {

    try{
        const token = req.header('Authorization').replace('Bearer', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

        if(!user){
            throw new Error();
        }

        req.user = user;
        req.token = token;
        next();
    }catch(e){
        res.status(401).send({ error: 'Please authenticate!' });
    }

};

module.exports = auth;

/**
 * steps for web token auth
 * 
 * 1. isolate the token from the header in the request
 * 2. verify the token based on the secret
 * 3. find a user that has the proper decoded id (we set up the token on the user id so when decoded 
 * we should get the user ID) and has the token inside of their token array
 * 4. throw error if no user is returned, return the user and the token on the request if successful
 */