const Post = require("../model/post");
const jwt = require("jsonwebtoken");

// Controller Method to create a post
exports.CreatePost = async (req, res) => {
	const token =
		req.body.token || req.query.token || req.headers["x-access-token"];

	if (!token) {
		return res.status(403).send("A token is required for authentication");
	}
	try {
		const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
		req.user = decodedToken;

		const { postTitle, postCaption, author, postHasMedia, postMedia } =
			req.body;

		if (!(postTitle && postCaption && author)) {
			res.status(400).send(
				"Post AuthorID and fields Title, Caption are required"
			);
		}

		const newPost = await Post.Create({
			postTitle,
			postCaption,
			author,
			postHasMedia,
			postMedia,
		});

		res.status(201).send({
			success: "Post created successfully",
		});
	} catch (error) {
		return res.status(401).send(error);
	}
};

// Controller Method to fetch a post
exports.FetchPost = async (req, res) => {
	const token =
		req.body.token || req.query.token || req.headers["x-access-token"];

	if (!token) {
		return res.status(403).send("A token is required for authentication");
	}
	try {
		const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
		req.user = decodedToken;

		const postID = req.body._id;

		if (!postID) {
			res.status(400).send("All fields are required");
		}
		const post = Post.findOne({ _id: postID });

		if (post) {
			res.status(200).send({
				success: "Profile fetched successfully",
				data: post,
			});
		} else {
			res.status(404).send({
				success: "Profile does not exist",
			});
		}
	} catch (error) {
		return res.status(401).send(error);
	}
};

// Controller Method to edit a post
exports.EditPost = async (req, res) => {
	const token =
		req.body.token || req.query.token || req.headers["x-access-token"];

	if (!token) {
		return res.status(403).send("A token is required for authentication");
	}
	try {
		const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
		req.user = decodedToken;

		const { postTitle, postCaption, author, postHasMedia, postMedia } =
			req.body;
		const postID = req.body._id;

		if (!(postTitle && postCaption && author)) {
			res.status(400).send(
				"Post AuthorID and fields Title, Caption are required"
			);
		}

		const post = await Post.updateOne(
			{
				_id: postID,
			},
			{
				postTitle,
				postCaption,
				author,
				postHasMedia,
				postMedia,
			}
		);

		res.status(201).send({
			success: "Post updated successfully",
		});
	} catch (error) {
		return res.status(401).send(error);
	}
};

// Controller Method to delete a post
exports.DeletePost = async (req, res) => {
	const token =
		req.body.token || req.query.token || req.headers["x-access-token"];

	if (!token) {
		return res.status(403).send("A token is required for authentication");
	}
	try {
		const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
		req.user = decodedToken;

		const postID = req.body._id;

		if (!postID) {
			res.status(400).send("PostID is required for this operation");
		}

		const post = await Post.deleteOne({
			_id: postID,
		});

		res.status(201).send({
			success: "Post deleted successfully",
		});
	} catch (error) {
		return res.status(401).send(error);
	}
};

// Controller Method to fetch all posts for a user
exports.FetchuserPosts = async (req, res) => {
	const token =
		req.body.token || req.query.token || req.headers["x-access-token"];

	if (!token) {
		return res.status(403).send("A token is required for authentication");
	}
	try {
		const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
		req.user = decodedToken;

		const { userID, role } = req.body;

		if (!userID) {
			return res
				.status(400)
				.send("A user ID is required for this opereation");
		}

		if (role != "admin") {
			return res
				.status(403)
				.send("You are not authorized to send this request");
		}

		const post = Post.find({ author: userID });

		if (post) {
			res.status(200).send({
				success: "Profile fetched successfully",
				data: post,
			});
		} else {
			res.status(404).send({
				success: "Profile does not exist",
			});
		}
	} catch (error) {
		return res.status(401).send(error);
	}
};

// Controller Method to fetch all posts
exports.FetchAllPost = async (req, res) => {
	const token =
		req.body.token || req.query.token || req.headers["x-access-token"];

	if (!token) {
		return res.status(403).send("A token is required for authentication");
	}
	try {
		const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
		req.user = decodedToken;

		const role = req.body.role;

		if (role != "admin") {
			return res
				.status(403)
				.send("You are not authorized to send this request");
		}

		const post = Post.find();

		if (post) {
			res.status(200).send({
				success: "Profile fetched successfully",
				data: post,
			});
		} else {
			res.status(404).send({
				success: "Profile does not exist",
			});
		}
	} catch (error) {
		return res.status(401).send(error);
	}
};
