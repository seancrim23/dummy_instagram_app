const express = require('express');
const Post = require('../models/post');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/posts', auth, async (req, res) => {
    const post = new Post({
        ...req.body,
        poster: req.user._id
    });

    try{
        await post.save();
        res.status(201).send(post);
    }catch(e){
        res.status(400).send(e);
    }
});

router.get('/posts', auth, async (req, res) => {

    try{
        await req.user.populate({
            path: 'posts'
        }).execPopulate();
        res.send(req.user.posts);
    }catch(e){
        res.status(500).send(e.stack);
    }

});

router.get('/posts/:id', auth, async (req, res) => {

    try{
        const post = await Post.findOne({ _id: req.params.id });
        if(!post){
            return res.status(404).send('Cannot find the post!');
        }

        res.send(post);
    }catch(e){
        res.status(500).send(e);
    }

});

router.patch('/posts/:id', auth, async (req, res) => {
    const objectKeys = Object.keys(req.body);
    const allowedKeys = ['caption'];
    const canUpdate = objectKeys.every(key => allowedKeys.includes(key));

    if(!canUpdate){
        return res.status(400).send('Please provide proper fields for update!');
    }

    try{

        const post = await Post.findOne({ _id: req.params.id });
        if(!post){
            throw new Error('Post does not exist to be updated!');
        }

        objectKeys.forEach(key => post[key] = req.body[key]);
        await post.save();
        res.send(post);
    }catch(e){
        res.status(400).send(e);
    }
});

router.delete('/posts/:id', auth, async (req, res) => {

    try{
        const post = await Post.findByIdAndDelete(req.params.id);
        if(!post){
            throw new Error('Post failed to be deleted!');
        }

        res.send(post);
    }catch(e){
        res.status(500).send(e);
    }

});

module.exports = router;