import { NextFunction, Response } from "express";
import { UserType } from "../DB/models/user";
import { AdminType } from "../DB/models/admin";
import { refreshTokenModel } from "../DB/models/refreshTokens";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET =
  "b9b924fac76ced51b717c96b9dc465a68fbbb1396d93ff5b211e71219877e455f36110bd814a3a99858bce40ef552f63c438364ace5afcd8f8dcc2575799f1dd";
const REFRESH_TOKEN_SECRET =
  "aa1e207051c835692d4fb6c9f3073bb5e32e747c12baa3bc0a208c0c6383730466dc626e35fb0a0d64aa1aba5cd8b11e69c4e15df02e40caef7a930854b76e32";

export function generateAccessTokenUser(doc: UserType) {
  const user = {
    userName: doc!.userName,
    usn: doc!.usn,
    password: doc!.password,
  };
  return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
}

export function generateAccessTokenAdmin(doc: AdminType) {
  const user = {
    userName: doc!.userName,
    collegeId: doc!.collegeId,
    password: doc!.password,
  };
  return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "40m" });
}

export function authenticateToken(req: any, res: Response, next: NextFunction) {
  const token = req.headers.authorization.split(" ")[1];
  const rt = req.headers.refreshToken;

  if (token === null) {
    console.log("Token is null");
    return res.sendStatus(401);
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, async (err: any, doc: any) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        if (rt === null)
          return res.status(401).send({ error: "Token not found" });

        return await refreshTokenModel.findOne(
          { rt },
          (err: Error, token: string) => {
            if (err) return res.sendStatus(403);
            if (rt === token) {
              jwt.verify(
                rt,
                REFRESH_TOKEN_SECRET,
                (err: any, currentUser: any) => {
                  if (err) return res.sendStatus(403);

                  const access_token = generateAccessTokenUser(currentUser);
                  req.headers.authorization = "Bearer " + access_token;
                }
              );
            }
          }
        );
      } else {
        return { err: "Error verifying access token", code: 403 };
      }
    }

    const user = doc.collegeId
      ? {
          userName: doc.userName,
          collegeId: doc.collegeId,
        }
      : {
          userName: doc.userName,
          usn: doc.usn,
        };

    req.user = user;
    next();
  });
}
