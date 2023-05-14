const express = require('express');
const path = require('path');
const app = express();
const { Server } = require('socket.io');
const http = require('http');
const { env } = require('process');
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.port || 8000;
  
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,"./index.html"));
});
  let users = {}
io.on('connection', (socket) => {
    socket.on('send name', (username) => {
        
            socket.broadcast.emit('send name', (username));
        
        users[socket.id] = username
        console.log("user joined",username)
    });
  
    socket.on('send message', (message) => {
        socket.broadcast.emit('receive', {message:message,name:users[socket.id]});
    });

    socket.on('disconnect', (message) => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id]
    });
});
  
server.listen(port, () => {
    console.log(`Server is listening at the port: ${port}`);
});
