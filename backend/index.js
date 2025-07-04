import express from 'express';
import dotenv from "dotenv";
import { connectDB } from './db/connectDB.js';
import authRoutes from './routes/auth.route.js';


dotenv.config();

const app = express(); // Create an instance of Express application
const PORT = process.env.PORT || 5000; // Set the port from environment variables or default to 5000

app.use(express.json()); // Middleware to parse JSON bodies 

app.get('/', (req, res) => {
    res.send('Hello, World 555!');
})

app.use("/api/auth", authRoutes) // Use the auth routes for authentication-related endpoints

app.listen(PORT, () => {
    connectDB()
        .then(() => console.log('Database connected successfully'))
        .catch(err => console.error('Database connection failed:', err));
    console.log(`Server is running on port ${PORT}`);
}); 

