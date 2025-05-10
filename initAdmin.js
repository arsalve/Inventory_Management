const mongoose = require('mongoose');
const User = require('./src/models/userModel');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const createAdminUser = async () => {
    const username = 'admin';
    const email = 'test@test.com';
    const password = 'admin123';
    const role = 'admin';

    try {
        const user = new User({ username, email, password, role });
        await user.save();
        console.log('Admin user created successfully');
    } catch (error) {
        console.log('Error creating admin user:', error.message);
    } finally {
        mongoose.connection.close();
    }
};

createAdminUser();