const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/predict", async (req, res) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/predict",  //Flask URL
      req.body
    );

    res.json(response.data);

   } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({
      error: "Prediction failed"
    });
  }
});

app.listen(3000, () => {
  console.log("Node API running on http://localhost:3000");
});
