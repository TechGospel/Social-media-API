const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	firstName: { type: String, default: null, required: true },
	lastName: { type: String, default: null, required: true },
	otherName: { type: String, default: null, required: false },
	displayName: { type: String, default: null, required: false },
	email: { type: String, default: null, required: true, unique: true },
	profilePicture: { type: String, default: null },
	coverPhoto: { type: String, default: null },
	dateOfBirth: { type: Date, default: null },
	password: { type: String, default: null, required: true },
	token: { type: String },
	hobbies: { type: Array, default: null },
	role: { type: String, default: "user" },
});

module.exports = mongoose.model("users", userSchema);
