const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { OAuth2Client } = require('google-auth-library');
const User = require('./models/user');

const app = express();
const port = 1010;

const GOOGLE_CLIENT_ID = '135800377028-s25a01piss36ae0bibjhnmadmai78r2t.apps.googleusercontent.com';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const uploadsDir = path.join(__dirname, 'public', 'uploads', 'cars');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'car-' + uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/admin', express.static(path.join(__dirname, 'public', 'admin')));

app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

app.use(express.static(__dirname));

mongoose.connect('mongodb://127.0.0.1:27017/carRental')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const users = require('./routes/users');
const cars = require('./routes/cars');
const bookings = require('./routes/bookings');
const contact = require('./routes/contact');

app.use('/users', users);
app.use('/api/cars', cars);
app.use('/api/bookings', bookings);
app.use('/api/contact', contact);

app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        const imageUrl = `/uploads/cars/${req.file.filename}`;
        
        res.json({
            message: 'Image uploaded successfully',
            imageUrl: imageUrl,
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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

app.post('/auth/google', async (req, res) => {
    try {
        const { credential } = req.body;

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { email, name, sub: googleId, picture } = payload;

        let user = await User.findOne({ email });

        if (user) {
            if (!user.googleId) {
                user.googleId = googleId;
                user.profilePicture = picture;
                user.isVerified = true;
                user.authProvider = 'google';
                await user.save();
            }
        } else {
            user = new User({
                name,
                email,
                googleId,
                profilePicture: picture,
                isVerified: true,
                authProvider: 'google'
            });
            await user.save();
        }

        res.status(200).json({
            message: 'Google authentication successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture
            }
        });

    } catch (error) {
        console.error('Google auth error:', error);
        res.status(401).json({
            error: 'Google authentication failed'
        });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        if (user.authProvider === 'google' && !user.password) {
            return res.status(401).json({ 
                error: 'This account uses Google Sign-In. Please use "Continue with Google" to log in.' 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            res.json({ 
                message: 'Login successful',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    profilePicture: user.profilePicture
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
            password: hashedPassword,
            authProvider: 'local'
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

app.get('/', (req, res) => {
    const homePath = path.join(__dirname, 'car-rental-website.html');
    if (fs.existsSync(homePath)) {
        res.sendFile(homePath);
    } else {
        res.status(404).send(`
            <h1>Home page not found</h1>
            <p>Expected location: ${homePath}</p>
            <p><a href="/signin">Go to Sign In</a></p>
        `);
    }
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
});

app.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signin.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.get('/fleet', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'fleet.html'));
});

app.get('/my-bookings', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'my-bookings.html'));
});

app.get('/booking', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'booking.html'));
});

app.listen(port, () => {
    console.log(`
Car Rental Server Running                
Server:http://localhost:${port}                
Admin Panel: http://localhost:${port}/admin                  
`);
});