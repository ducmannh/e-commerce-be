import { Request, Response } from "express";
import { IProduct } from "../types";
import Product from "../models/product";

interface CreateProductRequestType
  extends Pick<IProduct, "image" | "name" | "description" | "price"> {}

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { image, name, price, description }: CreateProductRequestType =
      req.body;

    const product = await Product.create({
      image,
      name,
      price,
      description,
    });

    res.send(product);
  } catch (error) {
    console.log("error in createProduct", error);
    res.send({ message: "Something went wrong while creating product" });
    throw error;
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({});
    res.send(products);
  } catch (error) {
    console.log("error in getProducts", error);
    res.send({ message: "Something went wrong while get products" });
    throw error;
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.send(product);
  } catch (error) {
    console.log("error in getProductById", error);
    res.send({
      message: "Something went wrong while getProductById",
    });
    throw error;
  }
};

export const deleteProductById = async (req: Request, res: Response) => {
  try {
    const productDelete = await Product.deleteOne({ _id: req.params.id });
    if (productDelete.deletedCount === 1) {
      const remainingProducts = await Product.find({});
      return res.send(remainingProducts);
    }
  } catch (error) {
    console.log("error in deleteProductById", error);
    res.send({
      message: "Something went wrong while deleteProductById",
    });
    throw error;
  }
};

export const updateProductById = async (req: Request, res: Response) => {
  try {
    const productUpdate = await Product.updateOne(
      { _id: req.params.id },
      req.body
    );
    if (productUpdate.matchedCount === 1) {
      const remainingProducts = await Product.find({});
      return res.send(remainingProducts);
    }
  } catch (error) {
    console.log("error in updateProductById", error);
    res.send({
      message: "Something went wrong while updateProductById",
    });
    throw error;
  }
};

export const deleteManyProductById = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;
    const deleteManyProduct = await Product.deleteMany({ _id: { $in: ids } });

    if (deleteManyProduct.deletedCount > 0) {
      const remainingProducts = await Product.find({});
      return res.send(remainingProducts);
    }
  } catch (error) {
    console.log("error in deleteManyProductById", error);
    res.send({
      message: "Something went wrong while deleteManyProductById",
    });
    throw error;
  }
};
