import express from "express";
import http from "http";
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

function onSocketClose() {
  console.log("Disconnected from the Browser X");
}

const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anonymous";
  console.log("Connected to Browser O");
  socket.on("close", onSocketClose);
  socket.on("message", (msg) => {
    const message = JSON.parse(msg);
    switch(message.type) {
      case "new_message":
        sockets.forEach((aSocket) => aSocket.send(`${socket.nickname} : ${message.payload}`));
      case "nickname":
        socket["nickname"] = message.payload;
    }
    // if(message.type === "new_message") {
    //   sockets.forEach((aSocket) => aSocket.send(message.payload));
    // } else if(message.type === "nickname") {
    //   console.log(message.payload);
    // }
    // sockets.forEach(aSocket => aSocket.send(message.toString('utf8')))
  });
});

server.listen(3000, handleListen);

{
  type:"message";
  payload:"hello everyone!";
}

{
  type:"nickname";
  payload:"nico";
}