import mongoose from "mongoose";

const connectDB = () => {
  if (mongoose.connections[0].readyState) {
    console.log("already connected");
    return;
  }
  const db: any = process.env.DB_URL;
  mongoose.connect(db, {}, (error: any) => {
    if (error) {
      throw error;
    }
    console.log("connected successfully");
  });
};

export default connectDB;
