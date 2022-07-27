import mongoose from "mongoose";

const connectDB = () => {
  if (mongoose.connections[0].readyState) {
    console.log("already connected");
    return;
  }
  mongoose.connect(process.env.DB_URL, {}, (error: any) => {
    if (error) {
      throw error;
    }
    console.log("connected successfully");
  });
};

export default connectDB;
