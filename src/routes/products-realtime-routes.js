import express from "express";
import { productManager } from "../modules/products-manager.js";
export const routerRealTimeProducts = express.Router();


routerRealTimeProducts.get("/", async function (req, res) {
    try {
      console.log("cliente conectado");
      const products = await productManager.getProducts();
      return res.render("real-time-products", { title: "Socket Server", products: products });
    } catch (error) {
      return res.status(500).json({ succes: "false", msg: error });
    }
  })
