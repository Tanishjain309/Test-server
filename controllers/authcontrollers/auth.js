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
    if (!user) return res.status(404).json({message:'No user Exist with this Email'});

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(404).json({message:'Incorrect password'});

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });
    res.cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000, // token valid for 24 hours
        httpOnly: true,
        secure: true, // since we are in development
        sameSite: 'none',
      })
    return res.status(200).json({ token, message:"LoggedIn Successfully.", data:{name: user.name, email: user.email} });
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