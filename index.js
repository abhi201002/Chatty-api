const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth.js");
const messageRoutes = require("./routes/messages.js");
const friendRoutes = require("./routes/friends.js");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors());
app.use(express.json());

const connect = async() =>{
  try{
    await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
          })
    console.log("DB Connection Successfull");
  }
  catch(err){
    throw(err);
  }
} 

app.use("/api/auth", authRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(process.env.PORT, () =>{
  connect()
  console.log(`Server started on ${process.env.PORT}`)
});
const io = socket(server, {
  cors: {
    origin: process.env.NODE_ENV == "production" ? "https://chatty-app-k276.onrender.com" : "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
