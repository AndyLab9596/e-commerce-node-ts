import mongoose from "mongoose";

const connectDb = (url: string) => mongoose.connect(url);

export default connectDb;