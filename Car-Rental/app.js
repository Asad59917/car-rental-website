const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const User = require('./models/user');

const app = express();
const port = 1010;

// ========================================
// MULTER CONFIGURATION FOR IMAGE UPLOADS
// ========================================

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'public', 'uploads', 'cars');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Created uploads directory:', uploadsDir);
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'car-' + uniqueSuffix + ext);
    }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// ========================================
// MIDDLEWARE - IMPORTANT: ORDER MATTERS!
// ========================================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CRITICAL: Serve static files BEFORE routes
// This serves all files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve CSS files explicitly
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/admin', express.static(path.join(__dirname, 'public', 'admin')));

// Serve uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Serve files from root directory (for car-rental-website.html assets)
app.use(express.static(__dirname));

// ========================================
// MONGODB CONNECTION
// ========================================
mongoose.connect('mongodb://127.0.0.1:27017/carRental')
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch(err => console.log('❌ MongoDB connection error:', err));

// ========================================
// API ROUTES (Before page routes)
// ========================================
const users = require('./routes/users');
const cars = require('./routes/cars');
const bookings = require('./routes/bookings');
const contact = require('./routes/contact');

app.use('/users', users);
app.use('/api/cars', cars);
app.use('/api/bookings', bookings);
app.use('/api/contact', contact);

// ========================================
// IMAGE UPLOAD ENDPOINT
// ========================================
app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        const imageUrl = `/uploads/cars/${req.file.filename}`;
        console.log('✅ Image uploaded successfully:', imageUrl);
        
        res.json({
            message: 'Image uploaded successfully',
            imageUrl: imageUrl,
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size
        });
    } catch (error) {
        console.error('❌ Upload error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Handle multer errors
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File size too large. Maximum is 5MB.' });
        }
        return res.status(400).json({ error: error.message });
    }
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    next();
});

// ========================================
// AUTHENTICATION ROUTES (Before page routes)
// ========================================

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            res.json({ 
                message: 'Login successful',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ 
            name, 
            email, 
            password: hashedPassword 
        });
        
        await newUser.save();
        
        res.status(201).json({ 
            message: 'Registration successful',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ========================================
// PAGE ROUTES (After API and static files)
// ========================================

// Home page - car-rental-website.html
app.get('/', (req, res) => {
    const homePath = path.join(__dirname, 'car-rental-website.html');
    if (fs.existsSync(homePath)) {
        console.log('✓ Serving car-rental-website.html');
        res.sendFile(homePath);
    } else {
        console.error('✗ car-rental-website.html not found at:', homePath);
        res.status(404).send(`
            <h1>Home page not found</h1>
            <p>Expected location: ${homePath}</p>
            <p><a href="/signin">Go to Sign In</a></p>
        `);
    }
});

// Admin panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
});

// Sign in page
app.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signin.html'));
});

// Contact page
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Fleet page
app.get('/fleet', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'fleet.html'));
});

// My Bookings page
app.get('/my-bookings', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'my-bookings.html'));
});

// Booking page
app.get('/booking', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'booking.html'));
});

// ========================================
// START SERVER
// ========================================
app.listen(port, () => {
    console.log(`
╔════════════════════════════════════════════════════════╗
║           🚗 CAR RENTAL SERVER STARTED 🚗              ║
╚════════════════════════════════════════════════════════╝

✅ Server running on http://localhost:${port}
✅ MongoDB connected to carRental database

📍 MAIN PAGES:
   - Home:        http://localhost:${port}/
   - Sign In:     http://localhost:${port}/signin
   - Contact:     http://localhost:${port}/contact
   - Fleet:       http://localhost:${port}/fleet
   - Booking:     http://localhost:${port}/booking
   - My Bookings: http://localhost:${port}/my-bookings
   - Admin:       http://localhost:${port}/admin

🔐 AUTHENTICATION:
   - POST /login
   - POST /register

📁 API ENDPOINTS:
   - Users:       /users/*
   - Cars:        /api/cars/*
   - Bookings:    /api/bookings/*
   - Contact:     /api/contact/*

📤 UPLOADS:
   - POST /api/upload
   - Directory: ${uploadsDir}

📧 CONTACT ENDPOINTS:
   - POST   /api/contact
   - GET    /api/contact
   - GET    /api/contact/unread-count
   - GET    /api/contact/:id
   - PUT    /api/contact/:id/status
   - DELETE /api/contact/:id

💡 TROUBLESHOOTING:
   - Static files served from: ${path.join(__dirname, 'public')}
   - CSS files at: /css/*
   - JS files at: /js/*
   - Admin files at: /admin/*

════════════════════════════════════════════════════════
`);
});