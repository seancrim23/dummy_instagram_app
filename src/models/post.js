const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    image: String,
    caption: String,
    poster: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    likes: [{
        like: {
            type: Schema.Types.ObjectId
        }
    }]
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;