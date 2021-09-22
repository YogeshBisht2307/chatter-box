const express = require('express');
const socketio = require('socket.io');
const http = require('http');

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
    socket.on('join', ({name, room}, callback) =>{
        const error = false;
        if(error){
            callback({ error: "Error" });
        }
    })
    socket.on('disconnect',() =>{
        console.log("User had left !!!!");
    })
});
//adding router to application
app.use(router);

server.listen(PORT, () => console.log(`Server has Started on port ${PORT}`));

