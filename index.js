const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
app.use(express.json());
//Import authRoute for login Routes
const authRoute = require('./Routes/authRoutes');
const posts = require('./Routes/posts');

dotenv.config();

//Connect to MongoDB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('Connected to DB!');
});

//Middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', posts);


app.listen(5000, () => console.log('Server up and running'));