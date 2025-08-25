import express from "express";//B3eNvCvMGXhR7A9B
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import dbConnect from "./config/database.js";
import userRouter from "./routes/user.route.js";
import messageRouter from "./routes/message.route.js";
import { Server } from "socket.io";

dotenv.config();


// create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize socket.io server
export const io = new Server(server, {
    cors: {origin: "*"}
})

// Store online users
export const userSocketMap = {}; // { userId: socketId }

// socket.io connection handler
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User Connected", userId);

    if(userId){
        userSocketMap[userId] = socket.id;
    }
    // Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", ()=> {
        console.log("User Disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

// Middleware setup
app.use(express.json({limit: "4mb"}));
app.use(cors());

// Routes setup
app.use('/api/status', (req,res) => { res.send("Server is live");});
app.use('/api/auth', userRouter);
app.use('/api/messages', messageRouter);

dbConnect();

if(process.env.NODE_ENV !== "production"){
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
        console.log(`App is running at PORT : ${PORT}`);
    })
}


// Export server for vercel
export default server;
