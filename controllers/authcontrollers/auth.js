import jwt from 'jsonwebtoken';
import User from '../../models/user-schema.js';

// Register a new user
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const user = new User({ name, email, password });
    await user.save();
    return res.status(201).json({ message: "Account Created Successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No user exists with this email' });
    }
    const now = new Date();
    if (user.isBlocked) {
      if (now < user.blockExpires) {
        return res.status(403).json({ message: 'Account is blocked. Try again later.' });
      } else {
        user.isBlocked = false;
        user.incorrectAttemptsLeft = 5;
        user.blockExpires = null;
      }
    }

    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      user.incorrectAttemptsLeft -= 1;

      if (user.incorrectAttemptsLeft < 0) {
        user.isBlocked = true;
        user.blockExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      }

      await user.save();
      return res.status(404).json({ message: user.isBlocked ? "Your account has been blocked due to security measures." : 'Incorrect password' });
    }

    user.incorrectAttemptsLeft = 5;
    user.isBlocked = false; 
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Set the cookie
    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return res.status(200).json({
      token,
      message: "Logged in successfully.",
      data: { name: user.name, email: user.email }
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


export const logout = (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: true,
        sameSite: 'none', 
        maxAge: 1000,
      });
    return res.status(201).json({ message: "Logged Out Successfully"});
}