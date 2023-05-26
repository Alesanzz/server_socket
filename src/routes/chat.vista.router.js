import express from "express";

export const routerVistaChat = express.Router();

//ver todos los productos o con un cierto rango de precio
routerVistaChat.get("/", (req, res) => {
    return res.render("chat-socket", {titulo: "Chat socket"})
  });
  
  