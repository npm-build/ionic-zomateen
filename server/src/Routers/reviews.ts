import express, { Response } from "express";
import { authenticateToken } from "../utils/token";
import { ReviewsModel, ReviewsType } from "../DB/models/reviews";

export const ReviewsRouter = express.Router();

ReviewsRouter.get(
  "/api/reviews",
  authenticateToken,
  async (req: any, res: Response) => {
    if (req.error) {
      return res.send({ error: req.error });
    }

    const token = req.headers.authorization!.split(" ")[1];
    const reviews = await ReviewsModel.find({});

    if (reviews) {
      return res.send({ reviews, token });
    }

    return res.send({ error: "No Reviews", token });
  }
);

ReviewsRouter.post(
  "/api/reviews/add",
  authenticateToken,
  async (req: any, res: Response) => {
    if (req.error) {
      return res.send({ error: req.error });
    }

    const token = req.headers.authorization!.split(" ")[1];
    const { foodId, review } = req.body;
    const { usn } = req.user;

    const individualReview = new ReviewsModel({
      usn,
      foodId,
      review,
    });

    await individualReview
      .save()
      .then(() => {
        return res.send({ message: "Review Added successfully", token });
      })
      .catch((e: Error) => {
        console.log(e);
        return res
          .status(401)
          .send({ error: e, message: "Error adding Review", token });
      });
  }
);

// ReviewsRouter.patch(
//   "/api/user/reviews/delete",
//   authenticateToken,
//   authenticateUser,
//   async (req: any, res: Response) => {
//     if (req.error) {
//       return res.send({ error: req.error });
//     }

//     const token = req.headers.authorization!.split(" ")[1];
//     const { usn } = req.user;
//     const foodId = req.body.foodId;

//     await userModel
//       .updateOne({ usn }, { $pullAll: { cartItems: [foodId] } })
//       .then((idk: any) => {
//         res.send({
//           message: "Food Item successfully deleted from cart",
//           token,
//         });
//       })
//       .catch((e: Error) =>
//         res.status(400).send({
//           error: e,
//           message: "Error deleting food item from cart",
//           token,
//         })
//       );
//   }
// );
