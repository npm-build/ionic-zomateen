import express, { Response } from "express";

import { OrderModel, OrderType } from "../DB/models/orders";
import { authenticateToken, authenticateUser } from "../utils/token";

export const OrderRouter = express.Router();

OrderRouter.get(
  "/api/order/getorders",
  authenticateToken,
  authenticateUser,
  async (req: any, res: Response) => {
    if (req.error) {
      return res.send({ error: req.error });
    }

    const token = req.headers.authorization!.split(" ")[1];
    const orders = await OrderModel.find({});
    return res.send({ orders, token });
  }
);

OrderRouter.get(
  "/api/order/getuserorders",
  authenticateToken,
  async (req: any, res: Response) => {
    if (req.error) {
      return res.send({ error: req.error });
    }

    const token = req.headers.authorization!.split(" ")[1];
    const user = req.user;
    const orders = await OrderModel.find({ usn: user.usn });
    return res.send({ orders, token });
  }
);

OrderRouter.post(
  "/api/order/add",
  authenticateToken,
  authenticateUser,
  async (req: any, res: Response) => {
    if (req.error) {
      return res.send({ error: req.error });
    }

    const token = req.headers.authorization!.split(" ")[1];
    const user = req.user;
    const { foodIds, customerName, messages, paymentMode } = req.body;

    const OrderItem: OrderType = new OrderModel({
      foodIds,
      customerName,
      usn: user.usn,
      messages,
      paymentMode,
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
  async (req: any, res: Response) => {
    if (req.error) {
      return res.send({ error: req.error });
    }

    const token = req.headers.authorization!.split(" ")[1];
    const { orderId, status, isCompleted, paid } = req.body;

    await OrderModel.updateOne({ orderId }, { status, isCompleted, paid })
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
  async (req: any, res: Response) => {
    if (req.error) {
      return res.send({ error: req.error });
    }

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
