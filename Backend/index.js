const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes_auth = require("./routes/auth");
const routes_general = require("./routes/route");
var session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const connectDB = require("./db");
const MongoDBStore = require('connect-mongodb-session')(session);

require('dotenv').config();

app.use(cookieParser());

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000', // This is your frontend URL
  credentials: true, // Enable credentials (cookies)
}));
// const store = new MongoDBStore({
//   uri: `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cosa-database.xypqv4j.mongodb.net/?retryWrites=true&w=majority`,
//   collection: 'sessions',
// });


// app.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: false,
//   store: store
// }));
// app.use("/auth", routes_auth);

app.use("/", routes_general);
app.use("/auth",routes_auth);

app.listen(process.env.PORT || 8000, () => {
  console.log(`connected to port ${process.env.PORT || 8000}`);
});
