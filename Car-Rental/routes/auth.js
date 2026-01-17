const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');

router.post('/auth/google', async (req, res) => {
    try {
        const { access_token } = req.body;

        if (!access_token) {
            return res.status(400).json({ error: 'Access token missing' });
        }

        const googleResponse = await axios.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        );

        const { email, name, sub: googleId, picture } = googleResponse.data;

        let user = await User.findOne({ email });

        if (user) {
            if (!user.googleId) {
                user.googleId = googleId;
                user.profilePicture = picture;
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
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture
            }
        });

    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Google authentication failed' });
    }
});

module.exports = router;
