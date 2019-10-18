const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mongoDB = process.env.DB_MONGO_URL;
console.log(mongoDB);
var users = [];
var userList = []
app.get('/', (req, res) => {
  res.sendFile(__dirname+"/index.html");
})



io.on("connection", function (socket) {


  socket.on("chat_message", function (data) {
    socket.broadcast.emit("chat_message", data);
    users.push(data);
    console.log(users);
    socket.broadcast.emit("all", users);
    socket.broadcast.emit("userCount", userList.length);
  });

  socket.on("disconnect", function (data) {
    socket.broadcast.emit("user_leave", this.username);
  });

  socket.on('userConnect', function(user) {
   
    let obj = userList.find(obj => obj.user == user.user);
    if (obj) {
      socket.broadcast.emit("userCount", userList.length);
      return;
    } else {
      userList.push(user);
      socket.broadcast.emit("userCount", userList.length);
    }
   
   
    console.log(userList);
    socket.emit("all", users);
   

  });
});

const port = process.env.PORT || 4000

server.listen(port);
