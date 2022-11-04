const PORT = process.env.PORT || 5001;
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const axios = require("axios");

dotenv.config();
app.use(cors());

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

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
