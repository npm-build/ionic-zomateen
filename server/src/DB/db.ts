import mongoose from "mongoose";

// const DBURITest = "mongodb://localhost:27017/users";
const DBURIProd = "mongodb+srv://user:user@cluster0.2blfy.mongodb.net/Cluster0";

mongoose.connect(DBURIProd, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

mongoose.set("useFindAndModify", false);

export const db = mongoose.connection;

db.on("error", (err) => {
  console.error(err);
  console.log("database is not connected");
});
