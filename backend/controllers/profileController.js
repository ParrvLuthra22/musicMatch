const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
}).single('photo');

// @desc    Get current user profile
// @route   GET /api/profile/me
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-passwordHash');
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/profile/update
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.bio = req.body.bio || user.bio;
            user.age = req.body.age || user.age;
            user.gender = req.body.gender || user.gender;

            if (req.body.preferences) {
                user.preferences = { ...user.preferences, ...req.body.preferences };
            }

            // Handle location update if provided
            if (req.body.location) {
                user.location = {
                    type: 'Point',
                    coordinates: [req.body.location.longitude, req.body.location.latitude]
                };
            }

            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Upload profile photo
// @route   POST /api/profile/upload-photo
// @access  Private
const uploadPhoto = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        try {
            const user = await User.findById(req.user._id);
            const photoUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/${req.file.filename}`;

            user.photos.push(photoUrl);
            await user.save();

            res.json({ photoUrl, photos: user.photos });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    });
};

// @desc    Delete profile photo
// @route   DELETE /api/profile/photo/:filename
// @access  Private
const deletePhoto = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const filename = req.params.filename;
        const photoUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/${filename}`;

        // Remove from DB
        user.photos = user.photos.filter(p => p !== photoUrl);
        await user.save();

        // Remove from filesystem
        const filePath = path.join(__dirname, '../uploads', filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.json(user.photos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    uploadPhoto,
    deletePhoto
};
