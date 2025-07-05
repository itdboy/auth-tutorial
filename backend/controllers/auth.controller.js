import bcryptjs from "bcryptjs";

import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import User from "../models/user.model.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";

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

    await sendVerificationEmail(user.email, verificationToken); // Simulate sending verification email
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

export const login = async (req, res) => {
  const { email, password } = req.body; // Get email and password from request body

  try {
    const user = await User.findOne({ email }); // Find user by email
    
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

     
    if (!user.isVerified) {
      return res.status(403).json({ error: "Email not verified" }); // Check if email is verified
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password); // Compare provided password with stored hashed password
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    generateTokenAndSetCookie(res, user._id); // Generate JWT and set cookie

    user.lastLogin = new Date(); // Update last login time
    await user.save(); // Save the updated user data

    console.log("Logged in user:", user);

    res.status(200).json({
      success: true,
      user: {
        ...user._doc,
        password: undefined, // Exclude password from response
      },
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
};

export const logout = async (req, res) => {
  console.log("Logout successful");
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

export const verifyEmail = async (req, res) => {
  // Simulate email verification logic
  const { code } = req.body; // Get the verification code from the request body
  try {
    const user = await User.findOne({
      verificationToken: code, // Find user by verification token
      verificationExpiresAt: { $gt: Date.now() }, // Check if the token is still valid
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid or expired verification code" });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationExpiresAt = null;
    await user.save();

    await sendWelcomeEmail(user.email, user.name); // Simulate sending a welcome email
   
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
