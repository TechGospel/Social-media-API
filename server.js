const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/database");
const accountController = require("./controllers/AccountController");
const auth = require("./middleware.js/auth");

// Server initailization
const app = express();

const PORT = process.env.PORT || 8080;
app.use(cors());
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//express.urlencoded({ extended: true });

app.listen(PORT, () => {
	console.log(`Hurray! server is running on port ${PORT} !`);
});

// Database connection creation
db.connect();

// Endpoints
app.get("/", (req, res) => {
	res.status(200).send("Welcome to this API");
});
app.post("/register", accountController.Register);
app.post("/login", accountController.Login);
app.post("/updateProfile", accountController.UpdateProfile);
app.post("/dashboard", auth, (req, res) => {
	res.status(200).send("Now on dashboard");
});
module.exports = app;
