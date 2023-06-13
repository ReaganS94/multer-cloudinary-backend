require("dotenv").config();
require("colors");
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./dbinit");
const appRoute = require("./routes/appRoute");

const PORT = process.env.PORT || 8080;

connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", appRoute);

app.get("/", (req, res) => {
  res.send("Multer + Cloudinary");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.rainbow);
});
