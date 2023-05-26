import express from "express";
//requiriendo el npm de socket para poder usar este tipo de servidores
import { Server } from "socket.io";

import { sourceDirname } from "./middlewares/dirname.js";
import { routerVistaChat } from "./routes/chat.vista.router.js";


const app = express();
const port = 3000;

//para configurar de que el servidor siempre responda devolviendo archivos en formato json
app.use(express.json());
//la siguiente linea es para poder usar mejor el req.query, extendiendo las opciones
app.use(express.urlencoded({ extended: true }));

//para configurar el motor de handlebars (las 3 lineas)
import handlebars from "express-handlebars";
app.engine("handlebars", handlebars.engine());
app.set("views", sourceDirname + "/views");
app.set("view engine", "handlebars");

//para configurar archivos como publicos
app.use(express.static("public"));

//endpoint tipo vista servidor socket
app.use("/chat-socket", routerVistaChat);


//para confirgurar el servidor socket hay que guardar el servidor http en una variable y luego ejecurtar el "Server" de socket.io sobre nuestro servidor http
const httpServer = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
const socketServer = new Server(httpServer);

let msgs = [];

socketServer.on("connection", (socket) => {
  socket.on("msg_front_to_back", (msg) => {
    msgs.push(msg);
    console.log(msgs);
    //socket.on = es para configurar que se debe estar pendiente de escuchar cuando envien el primer parametro del front
    //primer parametro = nombre del parametro a escuchar
    //segundo parametro = un objeto que se recibe del front
    socketServer.emit("msg_back_to_front", msgs);
    //socketServer.emit = es para realizar un envio de informacion del back al front a todos los canales/usuarios con el front (recordemos que existe un canal socket de front por cada chat/usuario que acceda a nuestra pagina)
    //primer parametro = nombre del parametro a enviar
    //segundo parametro = un objeto que se manda al front
  });
});
