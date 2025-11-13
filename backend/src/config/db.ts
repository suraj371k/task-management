import mongoose from "mongoose";

export const connectDb = () => {
  mongoose
    .connect(process.env.MONGODB_URI!)
    .then(() => console.log("mongodb connected successfully"))
    .catch((err) => console.log("Database connection failed", err));
};
