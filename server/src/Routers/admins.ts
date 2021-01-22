import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../DB/db";
import { refreshTokenModel } from "../DB/models/refreshTokens";
import { AdminModel, AdminType } from "../DB/models/admin";
import { generateAccessTokenAdmin } from "../utils/token";
export const AdminRouter = express.Router();

const REFRESH_TOKEN_SECRET =
  "aa1e207051c835622d4fb6c9f3073bb0e32e747c12baa3bc0a278c0c6383730566dc626e35fb0a0d64aa1aba5cd8b11e69c4c15df02e40caef7a930854b76e32";

AdminRouter.get("/api/admins", async (req: Request, res: Response) => {
  const users = await AdminModel.find({});
  res.send(users);
});

AdminRouter.get("/api/admin/dropDB", async (req: Request, res: Response) => {
  await db.dropDatabase();
  res.send({ msg: "Db dropped" });
});

AdminRouter.post("/api/admin/login", async (req: Request, res: Response) => {
  const userName = req.body.userName;
  const userPass = req.body.password;

  await AdminModel.findOne({ userName })
    .then((currentUser: AdminType | null) => {
      if (currentUser === null) return res.sendStatus(404);

      bcrypt.compare(userPass, currentUser.password, async (err, result) => {
        if (result) {
          const user = {
            userName: currentUser.userName,
            collegeId: currentUser.collegeId,
            password: currentUser.password,
          };

          const access_token = generateAccessTokenAdmin(currentUser);
          const refresh_token = jwt.sign(user, REFRESH_TOKEN_SECRET);

          const refreshToken = new refreshTokenModel({ token: refresh_token });
          await refreshToken.save();
          return res.send({
            accessToken: access_token,
            refreshToken: refresh_token,
          });
        }
        return res.send({ error: "Error logging in!!!", msg: err });
      });
    })
    .catch((err: Error) =>
      res.send({ error: "Error logging in!!!", msg: err })
    );
});

AdminRouter.get("/api/admin/logout", async (req: Request, res: Response) => {
  const refresh_token = req.body.token;
  await refreshTokenModel
    .deleteOne({ token: refresh_token })
    .then(() => {
      res.send("Logged out");
    })
    .catch((e: Error) => {
      console.log(e);
      return res.send({ error: "Error logging out", msg: e });
    });
});

AdminRouter.post("/api/admin/signup", async (req: Request, res: Response) => {
  const {
    collegeId,
    firstName,
    lastName,
    userName,
    phone,
    bodypassword,
  } = req.body;
  const dbUser = await AdminModel.findOne({ userName }).catch((e: Error) => {
    console.log(e);
    return res.status(401).send({ error: "Error creating user" });
  });

  if (dbUser) {
    return res.send("User already exists");
  }

  bcrypt.hash(bodypassword, 7, async (err, hashedPassword) => {
    if (err) return res.status(500).send({ error: err.message });

    const user = new AdminModel({
      collegeId,
      firstName,
      lastName,
      userName,
      phone,
      password: hashedPassword,
    });

    await user.save();
    return res.send({ message: "Account created successfully!! Please LogIn" });
  });
});

AdminRouter.patch(
  "/api/admin/forgotpassword",
  async (req: Request, res: Response) => {
    const name = req.body.name;
    const usn = req.body.usn;
    const password = req.body.password;

    await AdminModel.updateOne(
      { name, usn },
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

AdminRouter.post("/api/admin/token", async (req, res) => {
  const refresh_token = req.body.token;
  if (refresh_token === null) return res.sendStatus(401);

  await refreshTokenModel.findOne(
    { refresh_token },
    (err: Error, token: string) => {
      if (err) return res.sendStatus(403);
      if (refresh_token === token) {
        jwt.verify(
          refresh_token,
          REFRESH_TOKEN_SECRET,
          (err: any, currentUser: any) => {
            if (err) return res.sendStatus(403);
            const access_token = generateAccessTokenAdmin(currentUser);
            return res.json({ accessToken: access_token });
          }
        );
      }
    }
  );
});
