const express = require("express");
const app = express();
const connectDB = require("./db");

app.listen(process.env.PORT || 8000, () => {
  console.log(`connected to port ${process.env.PORT || 8000}`);
});
