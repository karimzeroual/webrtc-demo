const express = require("express");
const app = express();

const port = 4000;

const http = require("http");
const server = http.createServer(app);

const io = require("socket.io")(server);
app.use(express.static(__dirname + "/public"));
 

var users = [];
 
 
io.on('connection', function(socket) {
  console.log('new connection')
    
    saveUser(socket)
    io.emit('online-users-change','');
    socket.on('get-users', function() {
      socket.emit('online-users', users.filter(user=> user.socketId!=socket.id))
    })
    //io.emit('online-users',users)
   socket.on('disconnect', function() {
     console.log('Got disconnect!'); 
     deleteUser(socket)
     io.emit('online-users-change',''); 
    //  io.emit('online-users',users)
   })

   socket.on('sendTo', function(payload) {
    console.log('sendTo',payload,socket.id); 
    io.to(payload.to).emit('private-message',payload);
  })

  socket.on('my-peerid', function(payload) {
    console.log('sendTo',payload,socket.id); 
    io.to(payload.to).emit('received-peerid',payload);
  })

  
  socket.on('get-peer-id-request', function(payload) {
    console.log('get-peer-id-of',payload); 
    io.to(payload.to).emit('getme-peerId',payload);
   // io.to(payload.to).emit('private-message',payload);
  })
  
  })


  const saveUser=(socket)=> {
    let user ={
      socketId:socket.id,
      nickname:socket.handshake.query.username
    }
    users.push(user)  
  }
  
  const deleteUser=(socket)=> {
    users =  users.filter(item => item.socketId!= socket.id);
  }
app.get('/',(req,res)=> {
  res.sendFile('index.html')
}) 

app.get('/data',(req,res)=> {
  res.send( res.json({message:'heloo'}))
// res.sendFile('index.html')
})

app.get('/users_online/:id',(req,res)=> {
  console.log( req.params.id)
  res.send({clients:allClients})
// res.sendFile('index.html')
})


server.listen(port, () => console.log(`Server is running on port ${port}`));