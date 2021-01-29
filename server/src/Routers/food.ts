import express, { Request, Response, NextFunction } from "express";
import { UploadedFile } from "express-fileupload";

import { db } from "../DB/db";
import { authenticateToken } from "../utils/token";
import { FoodModel, FoodType } from "../DB/models/foodItem";

export const FoodRouter = express.Router();

FoodRouter.get(
  "/api/getfoodies",
  authenticateToken,
  async (req: Request, res: Response) => {
    const token = req.headers.authorization!.split(" ")[1];
    const foodies = await FoodModel.find({});
    res.send({ foodies, token });
  }
);

FoodRouter.post(
  "/api/food/getfood",
  authenticateToken,
  async (req: Request, res: Response) => {
    const token = req.headers.authorization!.split(" ")[1];
    const { foodId } = req.body;
    const food = await FoodModel.findOne({ foodId });
    return res.send({ food, token });
  }
);

FoodRouter.get("/api/food/dropDB", async (req: Request, res: Response) => {
  await db.dropDatabase();
  res.send({ msg: "Db dropped" });
});

FoodRouter.post(
  "/api/food/add",
  authenticateToken,
  authenticateUser,
  async (req: Request, res: Response) => {
    const token = req.headers.authorization!.split(" ")[1];
    const { name, foodId, tags, price, isAvailable, day } = req.body;

    const jsonTags = JSON.parse(tags);

    if (!req.files) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const file: UploadedFile = req.files["filePath"] as UploadedFile;

    file.mv("./uploads/" + file.name, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ err, token });
      }
    });

    const filePath = `uploads/${file.name}`;
    await FoodModel.findOne({ name })
      .then((food: FoodType | null) => {
        if (food?.name == name) {
          res.send({ message: "Food Item already exists", token });
        }
      })
      .catch((e: Error) => {
        console.error(e);
        res.status(401).send({ error: e, token });
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
        return res.send({ message: "Food Item Added successfully", token });
      })
      .catch((e: Error) => {
        console.log(e);
        return res.status(401).send({ error: e, token });
      });
  }
);

FoodRouter.patch(
  "/api/food/update",
  authenticateToken,
  authenticateUser,
  async (req: Request, res: Response) => {
    const token = req.headers.authorization!.split(" ")[1];
    const { foodId, isAvailable } = req.body;

    await FoodModel.updateOne({ foodId }, { isAvailable }).then(() =>
      res.send({ msg: "Updated!!!", token })
    );
  }
);

FoodRouter.delete(
  "/api/food/delete",
  authenticateToken,
  authenticateUser,
  async (req: Request, res: Response) => {
    const token = req.headers.authorization!.split(" ")[1];
    const { foodId } = req.body;

    await FoodModel.deleteOne({ foodId })
      .then(() => {
        return res.send({ msg: "Food Item deleted", token });
      })
      .catch((e: Error) => {
        console.log(e);
        return res.status(401).send({ error: "Error creating user", token });
      });
  }
);

function authenticateUser(req: any, res: Response, next: NextFunction) {
  const user = req.user;
  if (user.usn) {
    console.log("Error authorizing user!!!");
    return res.send("Error authorizing user!!!");
  } else next();
}
