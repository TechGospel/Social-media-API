const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

exports.connect = () => {
	mongoose
		.connect(MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => {
			console.log("Hurray! We connected to the database successfully");
		})
		.catch((error) => {
			console.log("An error occured! We couldn't connect to database");
			console.error(error);
			process.exit(1);
		});
};
