const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to mongoDB: ${conn.connection.name}`.underline);
  } catch (error) {
    console.error(error);
  }
};

module.exports = connectDB;
