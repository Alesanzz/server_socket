import { Server } from "socket.io";
import { productManager } from "./modules/products-manager.js";

export function connectSocket(httpServer) {
  const socketServer = new Server(httpServer);

  //socket para el chat comunitario
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

  //socket para el product manager
  socketServer.on("connection", (socket) => {
    socket.on("new-product-created", async (newProduct) => {
      try {
        await productManager.addProduct(newProduct);

        let allProducts = await productManager.getProducts();
        socketServer.emit("all-the-products", allProducts);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("delete-product", async (iidd) => {
      try {
        await productManager.deleteProduct(iidd);

        let allProducts = await productManager.getProducts();
        socketServer.emit("all-the-products", allProducts);
      } catch (error) {
        console.log(error);
      }
    });
  });
}
