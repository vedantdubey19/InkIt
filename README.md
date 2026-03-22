# 🖋️ InkIt (Poster)

A modern, full-stack social blogging platform built with **Node.js**, **Express**, and **MongoDB**. InkIt allows users to create, share, and engage with content in a vibrant and interactive community.


## 🚀 Features

- **🔐 Secure Authentication**: User signup and login with password hashing using `bcryptjs` and session-based authentication.
- **📝 Content Management**: Full CRUD operations for posts. Users can create, view, edit, and delete their own "Inks".
- **🖼️ Media Support**: Image uploads for posts via `multer` for a rich visual experience.
- **🏷️ Categorization**: Organize posts with categories/tags (e.g., General, Tech, Lifestyle).
- **👍 Engagement System**: Real-time-like upvote and downvote system to highlight top content.
- **💬 Community Interaction**: Comment system on every post to foster discussions.
- **👤 User Profiles**: Dedicated profile pages showcasing user activity and their published posts.
- **🔔 Flash Notifications**: Instant feedback for user actions like successful login, post creation, and errors.
- **📱 Responsive Design**: Fully responsive UI designed with EJS templates and custom CSS.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Frontend**: EJS (Embedded JavaScript), CSS3
- **Authentication**: Passport.js / Session-based (Bcryptjs)
- **Middleware**: Morgan (logging), Connect-Flash, Method-Override
- **File Uploads**: Multer

## 📦 Installation & Setup

Follow these steps to get the project running locally:

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally OR a MongoDB Atlas cluster URI.

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/inkit.git
cd inkit
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Environment Configuration
Create a `.env` file in the root directory and add the following variables:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/posterDB
SESSION_SECRET=your_super_secret_key_here
```

### 5. Seed the Database (Optional)
To quickly populate the app with some demo posts:
```bash
node seed.js
```

### 6. Run the Application
For development (with nodemon):
```bash
npm run dev
```
For production:
```bash
npm start
```

Your app should now be running at `http://localhost:3000`!

## 📂 Project Structure

```text
├── middleware/       # Custom auth and validation middleware
├── models/           # Mongoose schemas (Post, User)
├── public/           # Static assets (CSS, Images, JS)
├── routes/           # Express routes (Auth, Posts, Users)
├── views/            # EJS templates
│   ├── partials/     # Reusable UI components (header, footer)
├── app.js            # Main application entry point
├── seed.js           # Database seeding script
└── .env              # Environment variables
```

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request if you have any improvements or new features in mind.

## 📄 License

This project is licensed under the [Vedant Dubey]
