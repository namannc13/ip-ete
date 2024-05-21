const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');

const User = require('../models/userModel');

const registerUser = asyncHandler(async (req, res) => {
	const { username, email, password, darkMode } = req.body;

	if (!username || !email || !password) {
		res.status(400);
		throw new Error('Please fill in all fields.');
	}

	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(400);
		throw new Error('User already exists.');
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	const user = await User.create({
		username,
		email,
		password: hashedPassword,
		preferences: {
			darkMode,
		},
	});

	if (user) {
		res.status(201).json({
			_id: user._id,
			username: user.username,
			email: user.email,
			preferences: user.preferences,
			token: generateToken(user._id),
		});
	} else {
		res.status(400);
		throw new Error('Invalid user data.');
	}
});

const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	if (user && (await bcrypt.compare(password, user.password))) {
		res.status(201).json({
			_id: user._id,
			username: user.username,
			email: user.email,
			preferences: user.preferences,
			token: generateToken(user._id),
		});
	} else {
		res.status(400);
		throw new Error('Invalid credentials.');
	}
});

const updateUserPreferences = asyncHandler(async (req, res) => {
	if (!req.user) {
		res.status(401);
		throw new Error('User not found.');
	}
	const updatedUser = await User.findByIdAndUpdate(
		req.user.id,
		{ preferences: req.body },
		{ new: true }
	);
	res.status(200).json(updatedUser.preferences);
});

const getUserData = asyncHandler(async (req, res) => {
	res.status(200).json(req.user);
});

const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: '30d',
	});
};

module.exports = {
	registerUser,
	loginUser,
	getUserData,
	updateUserPreferences,
};
