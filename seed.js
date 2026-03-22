require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Post.deleteMany({});

        // Create a demo user
        const hashedPassword = await bcrypt.hash('password123', 10);
        const user = new User({
            username: 'demo_user',
            email: 'demo@example.com',
            password: hashedPassword
        });
        await user.save();

        const posts = [
            {
                title: 'Welcome to InkIt! 🚀',
                body: 'InkIt is a brand new platform for sharing your thoughts, news, and creative ideas. We are excited to have you here! Explore the different categories and start inking your first post.',
                tag: 'general',
                author: user._id
            },
            {
                title: 'The Future of AI in Web Development',
                body: 'Artificial Intelligence is transforming how we build apps. From Copilots to automated testing, the landscape is changing fast. What are your thoughts on AI agents like Antigravity?',
                tag: 'tech',
                author: user._id
            },
            {
                title: 'Top 5 Hidden Gaming Gems of 2026',
                body: 'Everyone is talking about the triple-A titles, but these indie developers are doing some incredible work. Check out "Neon Drift" and "Soul Weaver" – you won\'t regret it!',
                tag: 'gaming',
                author: user._id
            },
            {
                title: 'Global Climate Summit Results',
                body: 'The latest summit has concluded with surprising new commitments from major industrial nations. This could be a turning point for renewable energy transitions worldwide.',
                tag: 'news',
                author: user._id
            },
            {
                title: 'A Random Thought: Why do we ink?',
                body: 'Is it the desire to be heard? Or just a way to organize our chaotic minds? Either way, InkIt is the perfect place for these late-night musings.',
                tag: 'random',
                author: user._id
            },
            {
                title: 'New JavaScript Features You Should Know',
                body: 'ES2026 is bringing some amazing updates to the language. Records and Tuples are finally landing, making immutability a first-class citizen in JS development.',
                tag: 'tech',
                author: user._id
            }
        ];

        await Post.insertMany(posts);
        console.log('Seed successful! Added 1 user and 6 posts.');
        process.exit();
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
}

seed();
