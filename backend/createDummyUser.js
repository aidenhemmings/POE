require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/userModel');

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        createDummyUser();
    })
    .catch(err => console.error('Error connecting to MongoDB', err));


const createDummyUser = async () => {
    try {
        const email = "aiden@gmail.com";
        const password = "Aiden@1234"; 

        const user = await User.signupUser(email, password);
        console.log('User created:', user);
        
        mongoose.connection.close();
    } catch (error) {
        console.error('Error creating user:', error.message);
        mongoose.connection.close();
    }
};