import express from "express";
import {
  createProduct,
  deleteManyProductById,
  deleteProductById,
  getProductById,
  getProducts,
  updateProductById,
} from "../controller/product";

const productRoutes = express.Router();

productRoutes.get("/", getProducts);
productRoutes.get("/:id", getProductById);
productRoutes.post("/", createProduct);
productRoutes.delete("/:id", deleteProductById);
productRoutes.put("/:id", updateProductById);
productRoutes.delete("/", deleteManyProductById);

export default productRoutes;
