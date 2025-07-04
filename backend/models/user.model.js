import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    lastLogin: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: true },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpiresAt: { type: Date, default: null },
    verificationToken: { type: String, default: null },
    verificationExpiresAt: { type: Date, default: null },
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);

// export default User;
// export const createUser = async (userData) => {
//     try {
//         const user = new User(userData);
//         await user.save();
//         return user;
//     } catch (error) {
//         throw new Error("Error creating user: " + error.message);
//     }
// };