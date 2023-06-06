import { Request, Response } from "express";
import { IOrder, IOrderItem } from "../types";
import Order from "../models/order";
import stripe from "stripe";

interface CreateOrderType
  extends Pick<
    IOrder,
    "deliveryAddress" | "totatlPrice" | "user" | "orderItems"
  > {}

const BASE_UNIT = 100;

const getTotalAmount = (orderItems: IOrderItem[]) => {
  return (
    orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0) *
    BASE_UNIT
  );
};

export const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

/**
 *
 * 1. To make a request to stripe, it's gonna return paymentIntent, we've to pass currency and order amount
 * 2. Save paymentIntentId in order model
 * 3. Return paymentIntentId.client_secret
 *
 */

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { deliveryAddress, orderItems, totatlPrice, user }: CreateOrderType =
      req.body;

    const totalAmount = getTotalAmount(orderItems);

    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: totalAmount,
      currency: "usd",
    });

    const order = await Order.create({
      user,
      deliveryAddress,
      orderItems,
      totatlPrice,
      paymentIntentId: paymentIntent.id,
      paymentStatus: "pending",
      paymentDetails: {},
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log("error creating order", error);
    res.send({
      message: "Something went wrong in create order",
    });
    throw error;
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.find({});
    res.send(order);
  } catch (error) {
    console.log("error get order", error);
    res.send({
      message: "Something went wrong in get order",
    });
    throw error;
  }
};

export const deleteOrderById = async (req: Request, res: Response) => {
  try {
    const orderDeleteId = await Order.deleteOne({ _id: req.params.id });
    if (orderDeleteId.deletedCount === 1) {
      const remainingOrder = await Order.find({});
      return res.send(remainingOrder);
    }
  } catch (error) {
    console.log("error delete order", error);
    res.send({
      message: "Something went wrong in delete order",
    });
    throw error;
  }
};

export const deleteManyOrder = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;
    const orderIds = await Order.deleteMany({ _id: { $in: ids } });

    if (orderIds.deletedCount > 0) {
      const remainingOrder = await Order.find({});
      return res.send(remainingOrder);
    }
  } catch (error) {
    console.log("error deleteManyOrder", error);
    res.send({
      message: "Something went wrong in deleteManyOrder",
    });
    throw error;
  }
};
