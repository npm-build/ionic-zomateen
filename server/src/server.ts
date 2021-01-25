import express, { Request, Response, NextFunction } from "express";
import fileUpload from "express-fileupload";
// import cors from "cors";

import { UserRouter } from "./Routers/users";
import { FoodRouter } from "./Routers/food";
import { AdminRouter } from "./Routers/admins";
import { OrderRouter } from "./Routers/order";
import "./DB/db";

const app = express();

app.use((_req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Authorization, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET,HEAD,POST,PATCH,DELETE");
  next();
});
app.use(express.json());
app.use(
  fileUpload({
    preserveExtension: true,
    useTempFiles: true,
    createParentPath: true,
  })
);
app.use("/uploads", express.static("./uploads"));
app.use(UserRouter);
app.use(FoodRouter);
app.use(AdminRouter);
app.use(OrderRouter);

app.listen(process.env.PORT || 8000, () =>
  console.log("Server listening on PORT 8000")
);
