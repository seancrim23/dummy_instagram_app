const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try{
        await user.save();
        res.send(user);
    }catch(e){
        res.status(400).send(e);
    }
});

/**
 * login steps
 * 
 * 1. take the username and password and compare the two to the database (using the hash function)
 * 2. if successful, generate an auth token for that user for that session
 */
router.post('/users/login', async (req, res) => {

    try{
        const user = await User.compareCredentials(req.body.username, req.body.password);
        await user.generateAuthToken();

        res.send();
    }catch(e){
        res.status(400).send(e);
    }

});

/**
 * logout steps
 * 
 * 1. filter out the current token that is being used for auth from the users token array
 * 2. save the user
 */
router.post('/users/logout', auth, async (req, res) => {

    try{
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token != req.token;
        });

        await req.user.save();
        res.send();
    }catch(e){
        res.status(500).send({ error: 'Error logging out!' });
    }
});

module.exports = router;