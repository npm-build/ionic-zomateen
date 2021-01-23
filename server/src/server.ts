import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";

import { UserRouter } from "./Routers/users";
import { FoodRouter } from "./Routers/food";
import { AdminRouter } from "./Routers/admins";
import { OrderRouter } from "./Routers/order";
import "./DB/db";

const app = express();

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
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
