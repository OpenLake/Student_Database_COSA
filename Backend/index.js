const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// const routes_auth = require("./routes/route");
const routes_general = require("./routes/route");

var session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const MongoDBStore = require('connect-mongodb-session')(session);



app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());

app.use("/", routes_general);
app.use("/auth",routes_auth);

app.listen(process.env.PORT || 8000, () => {
  console.log(`connected to port ${process.env.PORT || 8000}`);
});
