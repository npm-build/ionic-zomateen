import express, { Request, Response, NextFunction } from "express";

import { OrderModel, OrderType } from "../DB/models/orders";
// import { db } from "../DB/db";
import { authenticateToken } from "../utils/token";
// import { FoodModel, FoodType } from "../DB/models/foodItem";

export const OrderRouter = express.Router();

OrderRouter.get(
  "/api/order/getorders",
  authenticateToken,
  async (req: Request, res: Response) => {
    const token = req.headers.authorization!.split(" ")[1];
    const orders = await OrderModel.find({});
    return res.send({ orders, token });
  }
);

OrderRouter.get(
  "/api/order/getuserorders",
  authenticateToken,
  async (req: any, res: Response) => {
    const token = req.headers.authorization!.split(" ")[1];
    const user = req.user;
    const orders = await OrderModel.find({ usn: user.usn });
    return res.send({ orders, token });
  }
);

OrderRouter.post(
  "/api/order/add",
  authenticateToken,
  async (req: any, res: Response) => {
    const token = req.headers.authorization!.split(" ")[1];
    const user = req.user;
    const { foodIds, customerName, messages } = req.body;

    const OrderItem: OrderType = new OrderModel({
      foodIds,
      customerName,
      usn: user.usn,
      messages,
    });

    await OrderItem.save()
      .then(() => {
        res.send({ message: "Order successfully placed", token });
      })
      .catch((e: Error) => {
        console.log(e);
        res.status(400).send({ error: "Error placing your order", token });
      });
  }
);

OrderRouter.patch(
  "/api/order/update",
  authenticateToken,
  authenticateUser,
  async (req: Request, res: Response) => {
    const token = req.headers.authorization!.split(" ")[1];
    const { orderId, status, isCompleted } = req.body;

    await OrderModel.updateOne({ orderId }, { status, isCompleted })
      .then(() => res.send({ message: "Updated Order!!!", token }))
      .catch((e: Error) => {
        console.error(e);
        res.send({ error: e, token });
      });
  }
);

OrderRouter.delete(
  "/api/order/delete",
  authenticateToken,
  authenticateUser,
  async (req: Request, res: Response) => {
    const token = req.headers.authorization!.split(" ")[1];
    const { orderId } = req.body;

    await OrderModel.deleteOne({ orderId })
      .then(() => {
        console.log("Order removed");
        return res.send({ message: "Order removed", token });
      })
      .catch((e: Error) => {
        console.log(e);
        return res.status(401).send({ error: "Error removing order", token });
      });
  }
);

function authenticateUser(req: any, res: Response, next: NextFunction) {
  const user = req.user;

  if (user.isAdmin === "false") {
    console.log("Error authenticating user!!!");
    return res.send({ error: "Error authenticating user!!!" });
  } else next();
}
