const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        name,
        email,
        passwordHash: hashedPassword,
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

// @desc    Redirect to Spotify Auth
// @route   GET /api/auth/spotify
// @access  Public
const spotifyAuth = (req, res) => {
    const scopes = 'user-read-private user-read-email user-top-read';
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
    const clientId = process.env.SPOTIFY_CLIENT_ID;

    res.redirect(
        `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`
    );
};

// @desc    Handle Spotify Callback
// @route   GET /api/auth/spotify/callback
// @access  Public
const spotifyCallback = async (req, res) => {
    const code = req.query.code || null;

    try {
        const params = new URLSearchParams();
        params.append('code', code);
        params.append('redirect_uri', process.env.SPOTIFY_REDIRECT_URI);
        params.append('grant_type', 'authorization_code');

        const tokenResponse = await axios.post(
            'https://accounts.spotify.com/api/token',
            params,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
                }
            }
        );

        const { access_token, refresh_token } = tokenResponse.data;

        // Get User Profile from Spotify
        const userProfileResponse = await axios.get('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        const spotifyUser = userProfileResponse.data;

        // Check if user exists
        let user = await User.findOne({ spotifyId: spotifyUser.id });

        if (!user) {
            // Check if user exists by email (to link accounts)
            user = await User.findOne({ email: spotifyUser.email });

            if (user) {
                // Link Spotify to existing account
                user.spotifyId = spotifyUser.id;
                user.accessToken = access_token;
                user.refreshToken = refresh_token;
                await user.save();
            } else {
                // Create new user
                user = await User.create({
                    name: spotifyUser.display_name,
                    email: spotifyUser.email,
                    spotifyId: spotifyUser.id,
                    accessToken: access_token,
                    refreshToken: refresh_token,
                    photos: spotifyUser.images.map(img => img.url)
                });
            }
        } else {
            // Update tokens
            user.accessToken = access_token;
            user.refreshToken = refresh_token;
            await user.save();
        }

        const token = generateToken(user._id);

        // Redirect to frontend with token
        res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);

    } catch (error) {
        console.error('Spotify Auth Error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=spotify_auth_failed`);
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    spotifyAuth,
    spotifyCallback
};
