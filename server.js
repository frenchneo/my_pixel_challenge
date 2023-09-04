const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const cors = require("cors");
const program = require("commander");

const PORT = process.env.PORT || 3000;

program
  .option("-i, --image <url>", "URL de l'image")
  .option("-w, --width <width>", "Largeur de l'image")
  .option("-h, --height <height>", "Hauteur de l'image")
  .parse(process.argv);

const options = program.opts();

var CorsOptions = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
  "Access-Control-Allow-Headers":
    "Origin, X-Requested-With, Content-Type, Accept",
};

app.use(cors(CorsOptions));

app.use(express.static("public"));

const image =
  options.image ||
  "http://www.fredzone.org/wp-content/uploads/2017/05/pikachu-640x432.jpg";
const width = options.width || 640;
const height = options.height || 432;
const pixel_clicked = [];
const clients = [];

io.sockets.on("connection", function (socket) {
  clients.push("user");
  socket.broadcast.emit("user", clients);
  socket.emit("base", { image, height, width, pixel_clicked, clients });

  socket.on("disconnect", function () {
    clients.splice(clients.indexOf("user"), 1);
    socket.broadcast.emit("user", clients);
  });

  socket.on("message", function (message) {
    pixel_clicked.push(message.cell);
    socket.emit("delete", { cell: message.cell, pixel_clicked });
    socket.broadcast.emit("delete", { cell: message.cell, pixel_clicked });
  });
});
server.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
