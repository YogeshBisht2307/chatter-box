const express = require('express');
const socketio = require('socket.io');
const http = require('http');

//importing users functions
const {addUser, removeUser, getUser, getUsersInRoom }  = require('./users.js');

// defining port const
const PORT = process.env.PORT || 5000

// importing router from router.js
const router = require('./router');

//basic template to run socket io work on node
const app = express();
const server = http.createServer(app);
const io = socketio(server);


io.on('connection', (socket) => {
    console.log("We have a new Connetion !!!!");
    //receiving the data which is sended from backend
    socket.on('join', ({ name, room }, callback) =>{
        const { error, user } = addUser({ id:socket.id, name, room });

        if(error) return callback(error);

        //default message which will display to user when they join the room.
        //emit is use to send the data from backend to front end.
        socket.emit('message', { user: 'admin', text: `${ user.name }, welcome to the room ${ user.room }`});

        //broadcasting message to everyone in the room that a specific member has joined the room.
        socket.broadcast.to( user.room ).emit( 'message' , { user: 'admin', text: `${ user.name } has joined...`});

        socket.join(user.room);

        callback();
    })

    //handling the message which will be sent by a particular person/user
    //on is used to recieve data from frontend to backend.

    socket.on('sendMessage', (message, callback) =>{
        const user = getUser(socket.id);

        io.to(user.room).emit('message', {user:user.name,text:message })

        callback();
    } );


    socket.on('disconnect',() =>{
        console.log("User had left !!!!");
    })
});
//adding router to application
app.use(router);

server.listen(PORT, () => console.log(`Server has Started on port ${PORT}`));

