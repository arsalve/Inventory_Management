require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const inventoryRoutes = require('./routes/inventoryRoutes');
const customerRoutes = require('./routes/customerRoutes');
const authRoutes = require('./routes/authRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const path = require('path');
const { expressjwt: jwt } = require('express-jwt');
const reportsRoutes = require('./routes/reportsRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/inventory', jwt({ secret: process.env.SECRET_KEY, algorithms: ['HS256'], requestProperty: 'auth' }), inventoryRoutes);
app.use('/api/customers', jwt({ secret: process.env.SECRET_KEY, algorithms: ['HS256'], requestProperty: 'auth' }), customerRoutes);
app.use('/api/suppliers', jwt({ secret: process.env.SECRET_KEY, algorithms: ['HS256'], requestProperty: 'auth' }), supplierRoutes);
app.use('/api/reports', jwt({ secret: process.env.SECRET_KEY, algorithms: ['HS256'], requestProperty: 'auth' }), reportsRoutes);
app.use(express.static(path.join(__dirname, 'views')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/admin-dashboard', jwt({ secret: process.env.SECRET_KEY, algorithms: ['HS256'], requestProperty: 'auth' }), (req, res) => {
    if (req.auth.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    res.sendFile(path.join(__dirname, 'views', 'admin-dashboard.html'));
});

app.get('/user-management', jwt({ secret: process.env.SECRET_KEY, algorithms: ['HS256'], requestProperty: 'auth' }), (req, res) => {
    if (req.auth.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    res.sendFile(path.join(__dirname, 'views', 'user-management.html'));
});

app.get('/add-user', jwt({ secret: process.env.SECRET_KEY, algorithms: ['HS256'], requestProperty: 'auth' }), (req, res) => {
    if (req.auth.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    res.sendFile(path.join(__dirname, 'views', 'add-user.html'));
});

app.get('/firstpage', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'firstpage.html'));
});

app.get('/inventory-reports', jwt({ secret: process.env.SECRET_KEY, algorithms: ['HS256'], requestProperty: 'auth' }), (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'inventory-reports.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/used-items', jwt({ secret: process.env.SECRET_KEY, algorithms: ['HS256'], requestProperty: 'auth' }), (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'used-items.html'));
});

// Error handling for JWT authentication
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        console.error('JWT Error:', err);
        res.status(401).json({ message: 'Invalid token' });
    } else {
        next(err);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});