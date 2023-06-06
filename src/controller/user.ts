import { Request, Response } from "express";
import User from "../models/user";
import { IUserAdmin } from "../types";

interface CreateUserRequestType
  extends Pick<
    IUserAdmin,
    "name" | "email" | "password" | "confirmPassword" | "phone"
  > {}

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    console.log("error in getUsers", error);
    res.send({ message: "Something went wrong in get products" });
    throw error;
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      phone,
    }: CreateUserRequestType = req.body;

    const user = await User.create({
      name,
      email,
      password,
      confirmPassword,
      phone,
    });
    console.log(user);

    res.send(user);
  } catch (error) {
    console.log("error in createUser", error);
    res.send({ message: "Something went wrong in get products" });
    throw error;
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = await User.findById(req.params.id);
    res.send(userId);
  } catch (error) {
    console.log("error in getUserById", error);
    res.send({ message: "Something went wrong in getUserById" });
    throw error;
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  try {
    const userId = await User.updateOne({ _id: req.params.id }, req.body);
    if (userId.matchedCount === 1) {
      const remainingUser = await User.find({});
      return res.send(remainingUser);
    }
  } catch (error) {
    console.log("error in updateUserById", error);
    res.send({ message: "Something went wrong in updateUserById" });
    throw error;
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const userId = await User.deleteOne({ _id: req.params.id });
    if (userId.deletedCount === 1) {
      const remainingUser = await User.find({});
      return res.send(remainingUser);
    }
  } catch (error) {
    console.log("error in deleteUserById", error);
    res.send({ message: "Something went wrong in deleteUserById" });
    throw error;
  }
};
