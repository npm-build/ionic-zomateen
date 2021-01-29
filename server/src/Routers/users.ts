import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../DB/db";
import { authenticateToken } from "../utils/token";
import { userModel, UserType } from "../DB/models/user";
import { generateAccessTokenUser } from "../utils/token";
import { FoodModel, FoodType } from "../DB/models/foodItem";
import {
  refreshTokenModel,
  RefreshTokenType,
} from "../DB/models/refreshTokens";

export const UserRouter = express.Router();
const REFRESH_TOKEN_SECRET =
  "aa1e207051c835692d4fb6c9f3073bb5e32e747c12baa3bc0a208c0c6383730466dc626e35fb0a0d64aa1aba5cd8b11e69c4e15df02e40caef7a930854b76e32";

UserRouter.get("/api/users", async (req: Request, res: Response) => {
  try {
    const users = await userModel.find({});
    return res.send(users);
  } catch (e: any) {
    console.log(e);
  }
});

UserRouter.get("/api/user/dropDB", async (req: Request, res: Response) => {
  await db.dropDatabase();
  res.send({ msg: "Db dropped" });
});

UserRouter.get(
  "/api/user/getuser",
  authenticateToken,
  async (req: any, res: Response) => {
    const token = req.headers.authorization!.split(" ")[1];
    const user: UserType = req.user;

    res.send({ user, token });
  }
);

UserRouter.post("/api/user/login", async (req: Request, res: Response) => {
  const userName = req.body.userName;
  const userPass = req.body.password;

  await userModel
    .findOne({ userName })
    .then((currentUser: UserType | null) => {
      if (currentUser === null)
        return res.status(404).send({ error: "User not found!!!" });

      bcrypt.compare(
        userPass,
        currentUser.password,
        async (_: Error, result: boolean) => {
          if (result) {
            const user = {
              userName: currentUser.userName,
              usn: currentUser.usn,
              password: currentUser.password,
            };
            const access_token = generateAccessTokenUser(currentUser);
            const refresh_token = await refreshTokenModel
              .findOne({ usn: user.usn })
              .then(async (token: RefreshTokenType | undefined) => {
                const rt = jwt.sign(user, REFRESH_TOKEN_SECRET);

                if (token) return token;
                else {
                  const refreshToken = new refreshTokenModel({
                    token: rt,
                    usn: user.usn,
                  });

                  await refreshToken.save();
                  return rt;
                }
              });

            return res.send({
              accessToken: access_token,
              refreshToken: refresh_token.token,
            });
          } else
            return res.status(400).send({
              error: "Error logging in!!!",
              message: "Passwords do not match!!!",
            });
        }
      );
    })
    .catch((err: Error) =>
      res.status(400).send({ error: "Error logging in!!!", msg: err })
    );
});

UserRouter.delete(
  "/api/user/logout",
  authenticateToken,
  async (req: any, res: Response) => {
    const user = req.user;
    const token = req.headers.authorization!.split(" ")[1];

    await refreshTokenModel
      .findOneAndDelete({ usn: user.usn })
      .then(() => res.send({ error: "Logged out", token }))
      .catch((e: Error) => res.send({ error: e, token }));
  }
);

UserRouter.post("/api/user/signup", async (req: Request, res: Response) => {
  const { firstName, lastName, phone, userName, usn, password } = req.body;
  const bodypassword = password;

  try {
    await userModel
      .findOne({ userName })
      .then((dbUser: UserType | null) => {
        dbUser
          ? res.send({ message: "User already exists" })
          : bcrypt.hash(bodypassword, 7, async (err, hashedPassword) => {
              if (err)
                return res
                  .status(500)
                  .send({ error: "Error!!!", message: err.message });

              const user = new userModel({
                firstName,
                lastName,
                phone,
                userName,
                usn,
                password: hashedPassword,
              });

              await user.save();
              return res.send({
                message: "Account created successfully!! Please LogIn",
              });
            });
      })
      .catch((e: any) => {
        res.send({ error: e });
        console.log(e);
      });
  } catch (e: any) {
    console.log(e);
    res.send({ error: e });
  }
});

UserRouter.patch(
  "/api/user/forgotpassword",
  async (req: Request, res: Response) => {
    const userName = req.body.userName;
    const usn = req.body.usn;
    const password = req.body.password;

    await userModel.updateOne(
      { userName, usn },
      { password },
      { runValidators: true },
      (err, resp) => {
        if (err) {
          return res.send({ error: "Error updating password!!!" });
        } else {
          return res.send({ msg: "Password Update successfully" });
        }
      }
    );
  }
);

// Favorites

UserRouter.patch(
  "/api/user/addtofavorites",
  authenticateToken,
  async (req: Request, res: Response) => {
    const token = req.headers.authorization!.split(" ")[1];
    const { usn, foodId } = req.body;

    try {
      await userModel.updateOne({ usn }, { $addToSet: { favorites: foodId } });
    } catch (e) {
      return res
        .status(401)
        .send({ error: "failed Item added to favorites successfully" });
    }

    return res.send({
      message: "Food Item added to favorites successfully",
      token,
    });
  }
);

UserRouter.get(
  "/api/user/getfavorites",
  authenticateToken,
  async (req: any, res: Response) => {
    const token = req.headers.authorization!.split(" ")[1];
    const { usn } = req.user;

    const user = await userModel.findOne({ usn });

    let favorites: number[] = [];

    if (user) {
      const favFoodItems: FoodType[] = [];
      favorites = user.favorites;

      for (const fav of favorites) {
        const food: FoodType | null = await FoodModel.findOne({ foodId: fav });
        if (food) {
          favFoodItems.push(food);
        }
      }

      return res.send({
        message: "Found your favorites",
        favorites: favFoodItems,
        token,
      });
    } else return res.send({ message: "User not found", token });
  }
);

UserRouter.patch(
  "/api/user/deletefromfavorites",
  authenticateToken,
  async (req: any, res: Response) => {
    const token = req.headers.authorization!.split(" ")[1];
    const usn = req.user.usn;
    const { foodId } = req.body;

    await userModel
      .updateOne({ usn }, { $pullAll: { favorites: foodId } })
      .then(() => {
        res.send({
          msg: "Food removed from favorites successfully!!!",
          token,
        });
      })
      .catch((e: Error) =>
        res.status(400).send({
          error: e,
          message: "Error removing from favorites!!!",
          token,
        })
      );
  }
);

// Cart Items

UserRouter.post(
  "/api/user/cart/add",
  authenticateToken,
  async (req: any, res: Response) => {
    const token = req.headers.authorization!.split(" ")[1];
    const foodId: number = req.body.foodId;
    const { usn } = req.user;

    if (!foodId)
      return res
        .status(401)
        .send({ error: "Error adding food item to cart", token });

    try {
      await userModel
        .updateOne({ usn }, { $addToSet: { cartItems: foodId } })
        .then(() => {
          return res.send({
            message: "Food Item Added to cart successfully",
            token,
          });
        });
    } catch (e) {
      console.log(e);
      return res
        .status(401)
        .send({ error: "Error adding food item to cart", token });
    }
  }
);

UserRouter.get(
  "/api/user/cart",
  authenticateToken,
  async (req: any, res: Response) => {
    const token = req.headers.authorization!.split(" ")[1];
    const user = req.user;
    const foodIds: number[] = await userModel.find({ usn: user.usn }).cartItems;
    const realFoodies = await FoodModel.find({});

    const cartFoodies: FoodType[] = [];

    for (const food of realFoodies) {
      foodIds?.some((fdId: number) => {
        if (food.foodId === fdId) {
          cartFoodies.push(food);
        }
      });
    }

    return res.send({ cartItems: cartFoodies, token });
  }
);

UserRouter.patch(
  "/api/user/cart/delete",
  authenticateToken,
  async (req: any, res: Response) => {
    const token = req.headers.authorization!.split(" ")[1];
    const user = req.user;
    const foodId = req.body.foodId;

    await userModel
      .updateOne({ usn: user.usn }, { $pullAll: { cartItems: foodId } })
      .then(() => {
        res.send({
          message: "Food Item successfully deleted from cart",
          token,
        });
      })
      .catch((e: Error) =>
        res.status(400).send({
          error: e,
          message: "Error deleting food item from cart",
          token,
        })
      );
  }
);
