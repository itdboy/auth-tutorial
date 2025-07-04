import bcryptjs from "bcryptjs";

import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js"; 
import User from "../models/user.model.js";

export const signup = async (req, res) => {
  try {
    // Simulate user signup logic
    const { email, name, password } = req.body;
    if (!name || !password || !email) {
      throw new Error("Missing username, email or password");
    }

    const userAlreadyExists = await User.findOne({ email }); // Simulate user existence check
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, error: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10); // Hash the password

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString(); // Simulate verification code generation

    // console.log("Verification Token:", verificationToken); // Log the verification token for <debugging></debugging>

    const user = new User({
      email,
      name,
      password: hashedPassword,
      verificationToken, // Store the verification token
      verificationExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // Set token expiration to 24 hours
    });

    await user.save(); // Simulate saving the user to the database

    //jwt
    generateTokenAndSetCookie(res, user._id); // Simulate JWT generation and response

    // If signup is successful
    res.status(201).json({
      success: true,
      message: "User signed up successfully",
      user: {
        ...user._doc,
        password: undefined, // Exclude password from response
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = (req, res) => {
  res.send("Login Controller");
};

export const logout = (req, res) => {
  res.send("Logout Controller");
};
