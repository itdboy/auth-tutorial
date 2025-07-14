import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {

    console.log("Verifying token...");
    const token = req.cookies.token
    console.log("Token found:", token ? "Yes" : "No");  
    if (!token) {
        return res.status(401).json({ success: false, error: "Unauthorized access, token not found" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) return res.status(403).json({ error: "Invalid token" });

        req.userId = decoded.userId; // Attach the decoded user information to the request object

        console.log("Token verified successfully, user ID:", req.userId);
        next(); // Call the next middleware or route handler

    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(403).json({ error: "Invalid token" });
    }
}