import jwt from "jsonwebtoken"; 

export const generateTokenAndSetCookie = (res, userId) => { 
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d" // Token expires in 7 days
    });     

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        samesite: "Strict", // Adjust based on your requirements
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return token;
};
