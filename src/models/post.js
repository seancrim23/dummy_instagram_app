const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    image: String,
    caption: String,
    poster: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;