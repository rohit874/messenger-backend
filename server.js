import express from 'express';
import router from './routes';
import dotenv from 'dotenv';
import mongoose from 'mongoose'
import cors from 'cors';
const app = express();

app.use(cors())

// .env file config
dotenv.config();
const { DB_URL } = process.env;
const PORT = process.env.PORT || 5000;

 
 
app.use(express.json());
app.use('/uploads', express.static('uploads'))
app.use('/images', express.static('images'))

app.use('/api', router); 
   
// Database connection 
mongoose.connect(DB_URL,{useNewUrlParser:true,useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console,'connection error'));
db.once('open',()=>{
    // console.log("db connected");
})

//server
var server = app.listen(PORT, ()=>console.log(`server  is listening on ${PORT}`))

//Socket connection
const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
  });

let users = [];
 const addUser = (userId, SocketId)=>{
    !users.some(user=>user.userId===userId) && users.push({userId, SocketId})
 }
 const getUser = (userId) =>{
     return users.find(user=>user.userId===userId);
 }

 const removeUser = (SocketId)=>{
     users = users.filter((user)=>user.SocketId!==SocketId)
 }


io.on('connection', (socket) => {
    //when user connect
    // console.log(socket.id);
    socket.emit('welcome', " hello from server socket io")

    //get userId and SocketId from user
    socket.on('addUser', (userId)=>{
        addUser(userId, socket.id);
        io.emit('getUsers', users);
    }) 

    //Send and get message

    socket.on('sendMessage', ({senderId, receiverId, text})=>{
        // console.log(users);
        const user = getUser(receiverId);
        if (user) {
            io.to(user.SocketId).emit("getMessage", {
                senderId,
                text 
            })   
        } 
    })

    //when user disconnect 
    socket.on('disconnect', ()=>{
        // console.log("user desconnected");
        removeUser(socket.id);
        io.emit('getUsers', users);
    })
});    