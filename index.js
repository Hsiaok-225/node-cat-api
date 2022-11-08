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
app.post("/auth/login", async (req, res) => {
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
app.post("/auth/register", async (req, res) => {
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
    res.status(501).json(err);
  }
});

// Create Favoriting Images
app.post("/api/createFavorite", async (req, res) => {
  try {
    const data = JSON.stringify(req.body);
    const config = {
      method: "post",
      url: "https://api.thecatapi.com/v1/favourites",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.THE_CAT_API,
      },
      data: data,
    };

    const response = await axios(config);
    const newFavourite = response.data;
    res.status(201).json(newFavourite);
  } catch (err) {
    res.status(501).json(err);
  }
});

// Delete Favarite Images
app.delete("/api/deleteFavorite", async (req, res) => {
  try {
    const { favouriteId } = req.query;
    console.log(favouriteId);
    const config = {
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.THE_CAT_API,
      },
    };
    const response = await axios.delete(
      `https://api.thecatapi.com/v1/favourites/${favouriteId}`,
      config
    );
    res.status(201).json(response.data);
  } catch (err) {
    console.log(err);
    res.status(501).json(err);
  }
});

// Getting Favorite Images
app.get("/api/getFavorite", async (req, res) => {
  try {
    const { sub_id } = req.query;
    const options = {
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.THE_CAT_API,
      },
    };
    const response = await axios(
      `https://api.thecatapi.com/v1/favourites?limit=20&sub_id=${sub_id}&order=DESC`,
      options
    );
    const getFavorite = response.data;
    res.status(201).json(getFavorite);
  } catch (err) {
    console.log(err);
    res.status(501).json("get-favorite-failed");
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
