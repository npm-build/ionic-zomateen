import mongoose from "mongoose";
import autoIncrement from "mongoose-auto-increment";

const DBURITest = "mongodb://localhost:27017/users";
const DBURIProd = "mongodb+srv://user:user@cluster0.2blfy.mongodb.net/Cluster0";

mongoose.connect(DBURIProd, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

mongoose.set("useFindAndModify", false);

export const db = mongoose.connection;
autoIncrement.initialize(db);

db.on("error", (err) => {
  console.error(err);
  console.log("database is not connected");
});
