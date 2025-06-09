import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Book from '../models/bookModel.js';

const signAccessToken = (userId) => {
	return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
		expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
	});
};

const signRefreshToken = (userId) => {
	return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
		expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
	});
};

export const signup = async (req, res, next) => {
	try {
		const newUser = await User.create({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			passwordConfirm: req.body.passwordConfirm,
		});
		const accessToken = signAccessToken(newUser._id);
		const refreshToken = signRefreshToken(newUser._id);
		newUser.refreshToken = refreshToken;
		await newUser.save({ validateBeforeSave: false });
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: false,
			sameSite: 'Strict',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});
		res.cookie('accessToken', accessToken, {
			httpOnly: true,
			secure: false,
			sameSite: 'Strict',
			path: '/',
			maxAge: 15 * 60 * 1000,
		});
		
	} catch (error) {
		console.error('Signup error:', err);
		res.status(400).json({ message: 'Signup failed', error: err.message });
	}
};

export const login = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res
			.status(401)
			.json({ message: 'Please provide email and password' });
	}
	const user = await User.findOne({ email }).select('+password');
	if (!user || !(await user.correctPassword(password, user.password))) {
		return res.status(401).json({ message: 'Incorect email or password' });
	}
	const accessToken = signAccessToken(user._id);
	const refreshToken = signRefreshToken(user._id);
	user.refreshToken = refreshToken;
	await user.save({ validateBeforeSave: false });

	res.cookie('refreshToken', refreshToken, {
		httpOnly: true,
		secure: false,
		sameSite: 'Strict',
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
	
	res.status(200).json({
		status: 'success',
		accessToken,
		user,
	});
};

export const refreshAccessToken = async (req, res) => {
	const token = req.cookies.refreshToken;
	if (!token) {
		return res.status(401).json({ message: 'No refresh token provided' });
	}
	try {
		const decodedRefreshToken = jwt.verify(
			token,
			process.env.JWT_REFRESH_SECRET
		);
		const currentUser = await User.findById(decodedRefreshToken.id).select('+refreshToken');
		if (!currentUser || currentUser.refreshToken !== token) {
			return res.status(403).json({ message: 'Invalid refresh token' });
		}
		const accessToken = signAccessToken(currentUser._id);
		res.status(200).json({
			accessToken,
			user: {
			  _id: currentUser._id,	
			  name: currentUser.name,
			  books: currentUser.books, 
			},
		  });
	} catch (error) {
		return res
			.status(403)
			.json({ message: 'Invalid or expired refresh token' });
	}
};

export const logout = async (req, res) => {
	const token = req.cookies.refreshToken;
	if (token) {
		try {
			const decodedToken = jwt.decode(token);
			const userId = decodedToken.id;

			await User.findByIdAndUpdate(userId, { refreshToken: null });
			res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'Strict' });

			return res.status(200).json({ message: 'Logged out successfully' });
		} catch (error) {
			console.error('Error logging out:', error);
			return res
				.status(500)
				.json({ message: 'Something went wrong during logout' });
		}
	} else {
		return res.status(400).json({ message: 'No refresh token found' });
	}
};
