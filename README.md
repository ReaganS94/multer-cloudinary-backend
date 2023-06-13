# Image upload with multer & cloudinary

Start by creating a new folder, `cd` into the folder and run `npm init -y`.
Install all the following packages:

- express
- dotenv
- cloudinary
- mongoose
- multer
- multer-storage-cloudinary
- nodemon
- cors

Remember to edit your `package.json` and create your scripts.

Create the `dbinit.js` file to connect to mongoDB using mongoose. Remember to export the function and import + call it in your entry point file.

```js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected to: ${conn.connection.name}}`);
  } catch (error) {
    console.error(error);
  }
};

module.exports = connectDB;
```

server.js:

```js
require("dotenv").config();
const express = require("express");
const connectDB = require("./dbinit");
const cors = require("cors");

const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Cloudinary & multer");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
```

Now we're gonna create our schema (aka model). Create a folder named `schemas` (or `models`) and, inside that, a file named `Image.js`

```js
const mongoose = require("mongoose");

const Image = new mongoose.Schema({
  url: { type: String },
  description: { type: String },
});
module.exports = mongoose.model("image", Image);
```

On to the controllers. Create a controllers folder, and you guessed it, a file named `appControllers.js` in it. Here's the code:

```js
const Image = require("../schemas/Image");

const getImages = async (req, res) => {
  try {
    let images = await Image.find();
    return res.status(200).json({ images });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

const uploadImage = async (req, res) => {
  try {
    if (req.file && req.file.path) {
      const image = new Image({
        description: req.body.desc,
        url: req.file.path,
      });
      await image.save();
      return res.status(200).json({ msg: "image successfully saved" });
    } else {
      console.log(req.file);
      return res.status(422).json({ error: "invalid" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};
module.exports = {
  getImages,
  uploadImage,
};
```

Before moving on to routes, we need to create the connection to cloudinary and the logic needed to upload. Create a folder called `services` and, in that folder, a file called `upload.js`

Here's the code we're gonna need for the `upload.js` file:

```js
// import multer, cloudinary and cloudinaryStorage
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// configuring the cloudinary account using your credentials
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// CloudinaryStorage helps us to create a storage option, which is required by multer to upload the file to a particular destination.
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "app", // name for the folder in the cloud
    allowedFormats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});
const upload = multer({ storage: storage });
module.exports = upload;
```

To get the cloud_name, api_key and secret, let's create a cloudinary account (https://cloudinary.com/). In the left navbar, click on `Dashboard` to see your credentials. Paste them into your `.env` file.

Your `.env` file should look like this by now:

MONGO_URI = <br/>
CLOUD_NAME = <br/>
API_KEY = <br/>
API_SECRET = <br/>

Create a `routes` folder and, inside the folder, a file called `appRoutes.js`. Here's the code:

```js
const express = require("express");
const upload = require("../services/upload");
const { uploadImage, getImages } = require("../controllers/appController");
const router = express.Router();

router.get("/images", getImages);

router.post("/upload", upload.single("picture"), uploadImage);
module.exports = router;
```

Add this to your `server.js`:

```js
const appRoute = require("./routes/appRoutes");

app.use("/api", appRoute);
```

Time to test things with Postman! In the body, select `form-data` and make sure to change the field from `Text` to `file`. Name the `Key` field `picture`, select a file under `Value` and send a POST request to `http://localhost:8080/api/upload`
