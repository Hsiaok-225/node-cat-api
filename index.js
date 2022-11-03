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

app.get("/api/moreCats", (req, res) => {
  // set page and oreder
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

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
