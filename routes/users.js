const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');

router.get('/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/posts');
        }

        const posts = await Post.find({ author: user._id })
            .sort({ createdAt: -1 })
            .populate('author', 'username');

        res.render('profile', { user, posts });
    } catch (err) {
        console.error(err);
        res.redirect('/posts');
    }
});

module.exports = router;
