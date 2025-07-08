import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import User from "../models/user.model.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../mailtrap/emails.js";

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

export const login = (req, res) => {
  res.send("Login Controller");
};

export const logout = async (req, res) => {
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
    user.verificationToken = undefined;
    user.verificationExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name); // Simulate sending a welcome email

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const forgotPassword = async (req, res) => {
  // Simulate forgot password logic
  const { email } = req.body; // Get the email from the request body
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    //gererate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // Token valid for 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt; // Set the reset token expiration time

    await user.save();

    // Send password reset email (simulated)
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params; // Get the reset token from the request parameters

    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    //update password
    const hashedPassword = await bcryptjs.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined; // Clear the reset token
    user.resetPasswordExpiresAt = undefined; // Clear the reset token expiration time
    await user.save();

    await sendResetSuccessEmail(user.email); // Simulate sending a reset success email

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password"); // Find the user by ID and exclude the password field

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
    //  res.status(200).json({
    //   success: true,
    //   message: "User authenticated successfully",
    //   ...user._doc,
    //   password: undefined // Exclude password from response
    // });
  } catch (error) {
    console.error("Check auth error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
