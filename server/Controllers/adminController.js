import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../Models/User.js';

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (email !== 'noreply-bakaiti@rythmiq.com') {
    return res.status(403).json({ message: 'Access denied: Not an admin account' });
  }

  try {
    const admin = await UserModel.findOne({ email });

    if (!admin || !admin.isAdmin) {
      return res.status(403).json({ message: 'Admin not found or not authorized' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
