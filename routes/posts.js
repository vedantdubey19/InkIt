const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Post = require('../models/Post');
const isLoggedIn = require('../middleware/authMiddleware');

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Home Feed
router.get('/', async (req, res) => {
    try {
        const { search, tag, page = 1 } = req.query;
        const limit = 10;
        const skip = (page - 1) * limit;

        let query = {};
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }
        if (tag) {
            query.tag = tag;
        }

        const posts = await Post.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .populate('author', 'username');

        const totalPosts = await Post.countDocuments(query);
        const totalPages = Math.ceil(totalPosts / limit);

        res.render('index', { 
            posts, 
            currentPage: parseInt(page), 
            totalPages, 
            search, 
            tag 
        });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

// Create form
router.get('/create', isLoggedIn, (req, res) => {
    res.render('create');
});

// Create post
router.post('/', isLoggedIn, upload.single('image'), async (req, res) => {
    try {
        const { title, body, tag } = req.body;
        const post = new Post({
            title,
            body,
            tag,
            author: req.session.userId,
            image: req.file ? `/uploads/${req.file.filename}` : null
        });
        await post.save();
        req.flash('success', 'Post created successfully!');
        res.redirect(`/posts/${post._id}`);
    } catch (err) {
        console.error(err);
        req.flash('error', 'Error creating post');
        res.redirect('/posts/create');
    }
});

// Single post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username')
            .populate('comments.author', 'username');
        if (!post) {
            req.flash('error', 'Post not found');
            return res.redirect('/posts');
        }
        res.render('post', { post });
    } catch (err) {
        console.error(err);
        res.redirect('/posts');
    }
});

// Edit form
router.get('/:id/edit', isLoggedIn, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post || post.author.toString() !== req.session.userId) {
            req.flash('error', 'Not authorized');
            return res.redirect('/posts');
        }
        res.render('edit', { post });
    } catch (err) {
        console.error(err);
        res.redirect('/posts');
    }
});

// Update post
router.put('/:id', isLoggedIn, upload.single('image'), async (req, res) => {
    try {
        const { title, body, tag } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post || post.author.toString() !== req.session.userId) {
            req.flash('error', 'Not authorized');
            return res.redirect('/posts');
        }
        
        post.title = title;
        post.body = body;
        post.tag = tag;
        if (req.file) {
            post.image = `/uploads/${req.file.filename}`;
        }
        await post.save();
        req.flash('success', 'Post updated!');
        res.redirect(`/posts/${post._id}`);
    } catch (err) {
        console.error(err);
        res.redirect('/posts');
    }
});

// Delete post
router.delete('/:id', isLoggedIn, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post || post.author.toString() !== req.session.userId) {
            req.flash('error', 'Not authorized');
            return res.redirect('/posts');
        }
        await post.deleteOne();
        req.flash('success', 'Post deleted');
        res.redirect('/posts');
    } catch (err) {
        console.error(err);
        res.redirect('/posts');
    }
});

// Vote
router.post('/:id/vote', isLoggedIn, async (req, res) => {
    try {
        const { type } = req.body; // 'up' or 'down'
        const post = await Post.findById(req.params.id);
        const userId = req.session.userId;

        if (type === 'up') {
            if (post.upvotes.includes(userId)) {
                post.upvotes.pull(userId);
            } else {
                post.downvotes.pull(userId);
                post.upvotes.push(userId);
            }
        } else {
            if (post.downvotes.includes(userId)) {
                post.downvotes.pull(userId);
            } else {
                post.upvotes.pull(userId);
                post.downvotes.push(userId);
            }
        }
        await post.save();
        res.redirect('back');
    } catch (err) {
        console.error(err);
        res.redirect('back');
    }
});

// Comments
router.post('/:id/comments', isLoggedIn, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.redirect('/posts');
        
        post.comments.push({
            body: req.body.body,
            author: req.session.userId
        });
        await post.save();
        req.flash('success', 'Comment added');
        res.redirect(`/posts/${post._id}`);
    } catch (err) {
        console.error(err);
        res.redirect('back');
    }
});

// Delete comment
router.delete('/:id/comments/:cid', isLoggedIn, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const comment = post.comments.id(req.params.cid);
        
        if (!comment || comment.author.toString() !== req.session.userId) {
            req.flash('error', 'Not authorized');
            return res.redirect('back');
        }
        
        comment.deleteOne();
        await post.save();
        req.flash('success', 'Comment deleted');
        res.redirect('back');
    } catch (err) {
        console.error(err);
        res.redirect('back');
    }
});

module.exports = router;
