import express from "express";
import {
  createOrder,
  deleteManyOrder,
  deleteOrderById,
  getOrder,
} from "../controller/order";

const orderRoutes = express.Router();

orderRoutes.get("/", getOrder);
orderRoutes.post("/", createOrder);
orderRoutes.delete("/:id", deleteOrderById);
orderRoutes.delete("/", deleteManyOrder);

export default orderRoutes;
