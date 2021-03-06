const express = require('express');
const User = require('../models/user');
const Post = require('../models/post');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try{
        const token = await user.generateAuthToken();
        await user.save();
        res.status(201).send({ user, token });
    }catch(e){
        res.status(400).send(e);
    }
});

router.post('/users/like/:id', auth, async (req, res) => {

    try{
        const igPost = await Post.findOne({ _id: req.params.id });
        if(!igPost){
            return res.status(404).send('Cannot find post!');
        }

        var alreadyLiked = req.user.likes.map(like => like.like.equals(igPost._id));
        if(alreadyLiked.includes(true)){
            return res.status(400).send('User has already liked this one!');
        }

        req.user.likes.push({ like: igPost._id });
        await req.user.save();
        igPost.likes.push({ like: req.user._id });
        await igPost.save();

        res.send(req.user);
    }catch(e){
        res.status(500).send(e.stack);
    }

});

router.get('/users/like', auth, async (req, res) => {

    try{
        const likedPosts = await Promise.all(req.user.likes.map(async (like) => {
            const oneLike = await Post.findOne({ _id: like.like });
            if(oneLike){
                return {
                    image: oneLike.image,
                    caption: oneLike.caption
                };
            }
        }));    
        res.send(likedPosts);
    }catch(e){
        res.status(500).send(e);
    }

});

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

router.get('/users', async (req, res) => {
    try{
        const users = await User.find();
        res.send(users);
    }catch(e){
        res.status(500).send(e);
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

router.delete('/users', auth, async (req, res) => {
    try{
        const user = await User.findOne({ _id: req.user._id });
        if(!user){
            return new Error('Cannot find user for delete!');
        }

        await user.delete();
        res.send(user);
    }catch(e){
        res.status(500).send(e);
    }
});

module.exports = router;