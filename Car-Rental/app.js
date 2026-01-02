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
// MIDDLEWARE
// ========================================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// FIXED: Proper static file serving
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from parent directory (for car-rental-website assets)
app.use(express.static(path.join(__dirname, '..')));

// Also serve from current directory
app.use(express.static(__dirname));

// Serve uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// ========================================
// MONGODB CONNECTION
// ========================================
mongoose.connect('mongodb://127.0.0.1:27017/carRental')
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.log('MongoDB connection error:', err));

// ========================================
// ROUTES
// ========================================
const users = require('./routes/users');
const cars = require('./routes/cars');
const bookings = require('./routes/bookings');

app.use('/users', users);
app.use('/api/cars', cars);
app.use('/api/bookings', bookings);

// ========================================
// IMAGE UPLOAD ENDPOINT
// ========================================
app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        // Generate the URL for the uploaded image
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
// PAGE ROUTES
// ========================================

// Serve admin panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
});

// Serve car-rental-website.html as the default home page (root /)
app.get('/', (req, res) => {
    // Try multiple paths to find the file
    const pathsToTry = [
        path.join(__dirname, 'car-rental-website.html'),
        path.join(__dirname, '..', 'car-rental-website.html'),
        path.join(__dirname, 'public', 'car-rental-website.html')
    ];
    
    let foundPath = null;
    for (const testPath of pathsToTry) {
        if (fs.existsSync(testPath)) {
            foundPath = testPath;
            break;
        }
    }
    
    if (foundPath) {
        console.log('✓ Serving car-rental-website.html from:', foundPath);
        res.sendFile(foundPath);
    } else {
        console.error('✗ car-rental-website.html not found. Tried:');
        pathsToTry.forEach(p => console.error('  -', p));
        res.status(404).send(`
            <h1>Car Rental Website Not Found</h1>
            <p>Please place car-rental-website.html in one of these locations:</p>
            <ul>
                ${pathsToTry.map(p => `<li>${p}</li>`).join('')}
            </ul>
            <p><a href="/signin">Go to Sign In Page</a></p>
            <p><a href="/admin">Go to Admin Panel</a></p>
        `);
    }
});

// Serve signin.html for /signin
app.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signin.html'));
});

// ========================================
// AUTHENTICATION ROUTES
// ========================================

// Login route with password hashing verification
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Compare hashed password
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

// Registration route with password hashing
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
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
// START SERVER
// ========================================
app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
    console.log(`✅ Admin panel: http://localhost:${port}/admin`);
    console.log(`✅ MongoDB connected to carRental database`);
    console.log(`✅ Image uploads directory: ${uploadsDir}`);
    console.log(`✅ Available routes:`);
    console.log(`   - GET  /`);
    console.log(`   - GET  /signin`);
    console.log(`   - GET  /admin`);
    console.log(`   - POST /login`);
    console.log(`   - POST /register`);
    console.log(`   - POST /api/upload (Image upload)`);
    console.log(`   - API  /users/*`);
    console.log(`   - API  /api/cars/*`);
    console.log(`   - API  /api/bookings/*`);
});