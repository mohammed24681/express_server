const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/productModel");
const multer = require("multer");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.static("images"));

// multer config

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb("helllllo", "./images");
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    // cb("whhhhy hel", fileName);
    cb(null, fileName);
  },
});

const upload = multer({ storage }).single("image");
app.get("/", (req, res) => {
  res.json([
    { id: 1, name: "mohammed ashraf" },
    { id: 2, name: "youssef ashraf" },
    { id: 3, name: "ameer mounir" },
  ]);
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find({}, { _id: 0, __v: 0 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/products/:prodId", async (req, res) => {
  const { prodId } = req.params;
  try {
    const product = await Product.findOne({ _id: prodId });
    // const products = await Product.findById(prodId);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/upload", upload, (req, res) => {
  const { file } = req;
  res.json({ file_name: file.filename });
});

app.delete("/remove/:imageName", (req, res) => {
  const { imageName } = req.params;
  try {
    // fs.unlinkSync(`./images/${imageName}`);
    fs.unlinkSync(`https://express-server-chi.vercel.app/${imageName}`);
    res.status(200).json({ message: "image deleted successfully !" });
  } catch (error) {
    res.status(500).json(error);
  }
});

mongoose
  .connect(
    "mongodb+srv://ashrafezeldeen111:hamo246813579@test.l7rtshz.mongodb.net/express_server?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connected");
    app.listen(3000 || process.env.PORT);
  })
  .catch(() => {
    console.log("errrorrr");
  });
