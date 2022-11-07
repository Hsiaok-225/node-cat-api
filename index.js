const PORT = process.env.PORT || 5001;
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const bcrypt = require("bcrypt");
const app = express();

const User = require("./models/User");

dotenv.config();

const mongoose = require("mongoose");
mongoose
  .connect(process.env.DATABASE_URI)
  .then(console.log("Connected to Mongo"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json("Server is running");
});

app.get("/api/cats", (req, res) => {
  axios
    .get(
      `https://api.thecatapi.com/v1/images/search?limit=15&has_breeds=1&order=RAND&api_key=${process.env.THE_CAT_API}`
    )
    .then((response) => {
      res.json(response.data);
    })
    .catch((err) => console.log(err));
});

// set page and order
app.get("/api/moreCats", (req, res) => {
  const pageNumber = req.query.pageNumber;
  axios
    .get(
      `https://api.thecatapi.com/v1/images/search?limit=12&page=${pageNumber}&has_breeds=1&order=RAND&api_key=${process.env.THE_CAT_API}`
    )
    .then((response) => {
      res.json(response.data);
    })
    .catch((err) => console.log(err));
});

// breeds_ids
app.get("/api/breeds/ids", (req, res) => {
  const breedsID = req.query.breeds_ids;
  axios
    .get(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${breedsID}&limit=12&order=RAND&api_key=${process.env.THE_CAT_API}`
    )
    .then((response) => {
      res.json(response.data);
    })
    .catch((err) => console.log(err));
});

// login
app.post("/login", async (req, res) => {
  try {
    // check user from db
    const user = await User.findOne({
      username: req.body.username,
    });
    if (!user) {
      return res.status(400).json("Wrong credentials");
    }
    // check password
    const vaildated = await bcrypt.compare(req.body.password, user.password);
    if (!vaildated) {
      return res.status(400).json("Wrong credentials");
    }
    // check wrong -> crash ?
    const { password, ...others } = user._doc;
    res.status(201).json(others);
  } catch (err) {
    res.status(501).json(err);
  }
});

// register
app.post("/register", async (req, res) => {
  console.log(req.body);
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });
    const user = await newUser.save();
    res.json(user);
  } catch (err) {
    // write wrong logic here
    res.status(501).json(err);
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
