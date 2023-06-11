import express from "express";

import { sourceDirname } from "./middlewares/dirname.js";
import { routerVistaChat } from "./routes/chat.vista.router.js";
import { routerRealTimeProducts } from "./routes/products-realtime-routes.js";


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
app.use("/realtimeproducts", routerRealTimeProducts);


//para confirgurar el servidor socket hay que importar el archivo donde se encuentra toda la logica del socket server, luego guardar el servidor http en una variable y por ultimo ejecurtar el "servidor" de socket.io sobre nuestro servidor http
import { connectSocket } from "./socket-server.js";
const httpServer = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

connectSocket(httpServer);
