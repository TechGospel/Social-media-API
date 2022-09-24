const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
	postID: { type: String, default: null, required: true, unique: true },
	postTitle: { type: String, default: null },
	postCaption: { type: String, default: null },
	createdAt: { type: Date, default: null },
	author: { type: String, default: null, required: true },
	postHasMedia: { type: Boolean, default: false },
	postMedia: { type: Array, default: null },
	noOfLikes: { type: Number, default: 0 },
});

module.exports = mongoose.model("post", PostSchema);
