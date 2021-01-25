import { NextFunction, Response } from "express";
import { UserType } from "../DB/models/user";
import { AdminType } from "../DB/models/admin";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET =
  "b9b924fac76ced51b717c96b9dc465a68fbbb1396d93ff5b211e71219877e455f36110bd814a3a99858bce40ef552f63c438364ace5afcd8f8dcc2575799f1dd";

export function generateAccessTokenUser(doc: UserType) {
  const user = {
    userName: doc!.userName,
    usn: doc!.usn,
    password: doc!.password,
  };
  return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "40m" });
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

  if (token === null) {
    console.log("Token is null");
    return res.sendStatus(401);
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err: any, doc: any): any => {
    if (err) {
      console.log(err);
      return { err: "Error verifying access token", code: 403 };
    }

    const user = {
      userName: doc.userName,
      usn: doc.usn,
    };

    req.user = user;
    next();
  });
}
