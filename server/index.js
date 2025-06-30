import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import setupSocket from './socket.js';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/AuthRoutes.js';
import contactRoutes from './routes/ContactRoutes.js';
import messagesRoutes from './routes/MessagesRoutes.js';
import channelRoutes from './routes/ChannelRoutes.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
const databaseUrl = process.env.DATABASE_URL;




app.use(cors({
    origin: process.env.ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use("/uploads/profiles",express.static("uploads/profiles"));
app.use("/uploads/files",express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/contacts",contactRoutes);
app.use("/api/messages",messagesRoutes);
app.use("/api/channel",channelRoutes);

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


setupSocket(server);

mongoose.connect(databaseUrl).then(()=>{
    console.log("Connected to MongoDB");    
}).catch((err)=>{
    console.error("Error connecting to MongoDB:", err);
});
