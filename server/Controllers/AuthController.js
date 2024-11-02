import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from "../Models/User.js";

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409).json({
                message: 'User already exists, please login',
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({ name, email, password: hashedPassword });
        await newUser.save(); // User saved

        const jwtToken = jwt.sign(
            { email: newUser.email, _id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: "Signup successful",
            success: true,
            jwtToken,
            email: newUser.email,
            name: newUser.name,
            userId: newUser._id 
        });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        const errorMsg = 'Authentication failed: email or password is incorrect';
        
        if (!user) {
            return res.status(403).json({ message: errorMsg, success: false });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(403).json({ message: errorMsg, success: false });
        }

        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Respond with success message, token, and user ID
        res.status(200).json({
            message: "Login successful",
            success: true,
            jwtToken,
            email,
            name: user.name,
            userId: user._id 
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

const selectGenres = async (req, res) => {
    try {
        const { genreIds } = req.body;
        if (!Array.isArray(genreIds) || genreIds.length < 3) {
            return res.status(400).json({
                success: false,
                message: "Please select at least 3 genres."
            });
        }

        const userId = req.user._id; 
        if (!userId) {
            return res.status(403).json({
                success: false,
                message: "User ID not found in request."
            });
        }
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId, 
            { interests: genreIds },
            { new: true, useFindAndModify: false } // Ensuring you get the updated document
        );

        console.log("Updated User Document after update:", updatedUser);

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }
        res.status(200).json({
            success: true,
            message: "Genres selected successfully",
            data: updatedUser
        });
    } catch (err) {
        console.error("Error saving genres:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export { signup, login, selectGenres };
