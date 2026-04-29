const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Validate password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      res.status(400);
      throw new Error('Password must be at least 6 characters long and contain at least one uppercase letter, one number, and one special character');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        profileImage: user.profileImage,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/v1/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        profileImage: user.profileImage,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile (Auth check)
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        profileImage: user.profileImage,
        settings: user.settings
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/v1/auth/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const { name, email, profileImage, currentPassword, newPassword } = req.body;

    // --- Password change path: uses .save() to trigger bcrypt pre-save hook ---
    if (newPassword) {
      const user = await User.findById(req.user._id).select('+password');
      if (!user) { res.status(404); throw new Error('User not found'); }

      if (!currentPassword) { res.status(400); throw new Error('Please provide your current password'); }

      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) { res.status(401); throw new Error('Current password is incorrect'); }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
      if (!passwordRegex.test(newPassword)) {
        res.status(400);
        throw new Error('Password must be at least 6 characters with uppercase, number, and special character');
      }

      user.password = newPassword;
      await user.save(); // triggers bcrypt hook

      return res.json({ message: 'Password updated successfully' });
    }

    // --- Profile fields path: uses findByIdAndUpdate (skips pre-save hook) ---
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (profileImage !== undefined) updateFields.profileImage = profileImage;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedUser) { res.status(404); throw new Error('User not found'); }

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      currency: updatedUser.currency,
      profileImage: updatedUser.profileImage,
      token: require('../utils/generateToken')(updatedUser._id),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateUserProfile,
};
