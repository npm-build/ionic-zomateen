import express, { Request, Response, NextFunction } from "express";
import { UploadedFile } from "express-fileupload";

import { db } from "../DB/db";
import { authenticateToken } from "../utils/token";
import { FoodModel, FoodType } from "../DB/models/foodItem";
import { CartModel, CartType } from "../DB/models/cart";

export const FoodRouter = express.Router();

FoodRouter.get(
  "/api/getfoodies",
  authenticateToken,
  async (req: Request, res: Response) => {
    const foodies = await FoodModel.find({});
    res.send(foodies);
  }
);

FoodRouter.post(
  "/api/food/getfood",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { foodId } = req.body;
    const food = await FoodModel.findOne({ foodId });
    return res.send(food);
  }
);

FoodRouter.get("/api/food/dropDB", async (req: Request, res: Response) => {
  await db.dropDatabase();
  res.send({ msg: "Db dropped" });
});

FoodRouter.post(
  "/api/food/addtocart",
  authenticateToken,
  async (req: Request, res: Response) => {
    const foodId: number = req.body.foodId;

    const foodItem: CartType = new CartModel({
      foodId,
    });

    await foodItem
      .save()
      .then((resp) => {
        console.log("Food Item Added to cart successfully");
        return res.send({ message: "Food Item Added to cart successfully" });
      })
      .catch((e: Error) => {
        return res
          .status(401)
          .send({ error: "Error adding food item to cart" });
      });
  }
);

FoodRouter.get(
  "/api/food/cartitems",
  authenticateToken,
  async (req: Request, res: Response) => {
    const foodies = await CartModel.find({});
    const realFoodies = await FoodModel.find({});

    const cartFoodies: FoodType[] = [];

    for (const food of realFoodies) {
      foodies?.some((fd: FoodType) => {
        if (food.foodId === fd.foodId) {
          cartFoodies.push(food);
        }
      });
    }

    console.log(cartFoodies);
    return res.send(cartFoodies);
  }
);

FoodRouter.delete(
  "/api/food/cartitems",
  authenticateToken,
  async (req: Request, res: Response) => {
    const foodId = req.body.foodId;
    console.log(foodId);

    await CartModel.deleteOne({ foodId })
      .then(() => {
        console.log("Food Item successfully deleted from cart");
        return res.send({
          message: "Food Item successfully deleted from cart",
        });
      })
      .catch((e: Error) => {
        return res
          .status(401)
          .send({ error: "Error deleting food item from cart" });
      });
  }
);

FoodRouter.post(
  "/api/food/add",
  authenticateToken,
  authenticateUser,
  async (req: Request, res: Response) => {
    const { name, foodId, tags, price, isAvailable, day } = req.body;

    const jsonTags = JSON.parse(tags);
    console.log(jsonTags);

    if (!req.files) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const file: UploadedFile = req.files["filePath"] as UploadedFile;

    console.log("moving");
    file.mv("./uploads/" + file.name, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
      console.log("Done moving");
    });

    const filePath = `uploads/${file.name}`;
    await FoodModel.findOne({ name })
      .then(async (food: FoodType) => {
        if (food?.name == name) {
          return res.send({ message: "Food Item already exists" });
        }
      })
      .catch((e: Error) => {
        console.error(e);
        return res.status(401).send({ error: e });
      });

    const foodItem = new FoodModel({
      name,
      foodId,
      tags: jsonTags,
      filePath,
      isAvailable,
      price,
      day,
    });

    await foodItem
      .save()
      .then((resp) => {
        console.log("Food Item Added successfully");
        return res.send({ message: "Food Item Added successfully" });
      })
      .catch((e: Error) => {
        console.log(e);
        return res.status(401).send({ error: e });
      });
  }
);

FoodRouter.patch(
  "/api/food/update",
  authenticateToken,
  authenticateUser,
  async (req: Request, res: Response) => {
    const { foodId, isAvailable } = req.body;
    console.log("Updating...");

    await FoodModel.updateOne({ foodId }, { isAvailable }).then(() =>
      res.send({ msg: "Updated!!!" })
    );
  }
);

FoodRouter.delete(
  "/api/food/delete",
  authenticateToken,
  authenticateUser,
  async (req: Request, res: Response) => {
    const { foodId } = req.body;

    await FoodModel.deleteOne({ foodId })
      .then(() => {
        return res.send({ msg: "Food Item deleted" });
      })
      .catch((e: Error) => {
        console.log(e);
        return res.status(401).send({ error: "Error creating user" });
      });
  }
);

function authenticateUser(req: any, res: Response, next: NextFunction) {
  const user = req.user;
  if (user.usn) {
    console.log("Error authenticating user!!!");
    return res.send("Error authenticating user!!!");
  } else next();
}
