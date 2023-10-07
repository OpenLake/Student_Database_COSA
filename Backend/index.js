const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const routes_auth = require("./routes/auth");
const routes_general = require("./routes/route");

const app = express();

app.use(cookieParser());
app.use(cors({credentials: true, origin: process.env.CLIENT}));


// app.use("/auth", routes_auth);
// app.use("/", routes_general);

app.listen(process.env.PORT || 8000, () => {
  console.log(`connected to port ${process.env.PORT || 8000}`);
});
