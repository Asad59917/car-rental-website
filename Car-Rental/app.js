const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const User = require('./models/user');

const app = express();
const port = 1010;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// FIXED: Proper static file serving
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from parent directory (for car-rental-website assets)
app.use(express.static(path.join(__dirname, '..')));

// Also serve from current directory
app.use(express.static(__dirname));

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/carRental')
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.log('MongoDB connection error:', err));

// Routes
const users = require('./routes/users');
app.use('/users', users);

// Serve car-rental-website.html as the default home page (root /)
app.get('/', (req, res) => {
    const fs = require('fs');
    
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
        `);
    }
});

// Debug route to check paths
app.get('/debug-paths', (req, res) => {
    const fs = require('fs');
    
    const paths = {
        '__dirname': __dirname,
        'current': path.join(__dirname, 'car-rental-website.html'),
        'parent': path.join(__dirname, '..', 'car-rental-website.html'),
        'parent2': path.join(__dirname, '..', '..', 'car-rental-website.html'),
        'currentExists': fs.existsSync(path.join(__dirname, 'car-rental-website.html')),
        'parentExists': fs.existsSync(path.join(__dirname, '..', 'car-rental-website.html')),
        'parent2Exists': fs.existsSync(path.join(__dirname, '..', '..', 'car-rental-website.html'))
    };
    
    res.json(paths);
});

// Serve car-rental-website.html from parent directory
app.get(['/home', '/car-rental-website.html'], (req, res) => {
    const fs = require('fs');
    
    // Try multiple paths
    const pathsToTry = [
        path.join(__dirname, 'car-rental-website.html'),
        path.join(__dirname, '..', 'car-rental-website.html'),
        path.join(__dirname, '..', '..', 'car-rental-website.html')
    ];
    
    let foundPath = null;
    for (const testPath of pathsToTry) {
        if (fs.existsSync(testPath)) {
            foundPath = testPath;
            break;
        }
    }
    
    if (foundPath) {
        res.sendFile(foundPath);
    } else {
        res.status(404).send(`
            <h1>File Not Found</h1>
            <p>Tried the following paths:</p>
            <ul>
                ${pathsToTry.map(p => `<li>${p} - ${fs.existsSync(p) ? 'EXISTS' : 'NOT FOUND'}</li>`).join('')}
            </ul>
            <p><a href="/debug-paths">View debug info</a></p>
        `);
    }
});

// Serve signin.html for /signin
app.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signin.html'));
});

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

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    
});