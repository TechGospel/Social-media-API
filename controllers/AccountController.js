const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.Register = async (req, res) => {
	try {
		const { firstName, lastName, displayName, email, password } = req.body;

		if (!(firstName && lastName && displayName && email && password)) {
			res.status(400).send("All fields are required");
		}
		const existingUser = await User.findOne({ email: email });
		console.log(existingUser);

		if (existingUser) {
			return res.status(409).send("User Already Exist. Please Login");
		}

		const encryptedPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			firstName: firstName,
			lastName: lastName,
			email: email,
			password: encryptedPassword,
		});

		const token = jwt.sign(
			{ userID: user._id, email },
			process.env.TOKEN_KEY,
			{
				expiresIn: "24h",
			}
		);

		user.token = token;

		res.status(201).json({
			success: "Post updated successfully",
			data: user,
		});
	} catch (error) {
		console.log("Oops!! We encountered an error!");
		console.log(error);
	}
};

exports.Login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!(email && password)) {
			res.status(400).send("Please fill all fields correctly");
		}

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			if (await bcrypt.compare(password, existingUser.password)) {
				const token = jwt.sign(
					{ userID: existingUser._id, email },
					process.env.TOKEN_KEY,
					{
						expiresIn: "24h",
					}
				);

				existingUser.token = token;

				res.status(200).json({
					success: "Post updated successfully",
					data: existingUser,
				});
			} else {
				res.status(400).send(`Incorrect password for user ${email}.`);
			}
		} else {
			res.status(400).send(
				"User with submitted credentials does not exist"
			);
		}
	} catch (error) {
		console.log("Oops!! We encountered an error!");
		console.log(error);
	}
};

exports.FetchProfile = async (req, res) => {
	const token =
		req.body.token || req.query.token || req.headers["x-access-token"];

	if (!token) {
		return res.status(403).send("A token is required for authentication");
	}
	try {
		const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
		req.user = decodedToken;

		const email = req.body;

		if (!email) {
			res.status(400).send("All fields are required");
		}
		const existingUser = User.findOne({ email });

		if (existingUser) {
			res.status(200).send({
				success: "Profile fetched successfully",
				data: existingUser,
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

exports.UpdateProfile = async (req, res) => {
	const token =
		req.body.token || req.query.token || req.headers["x-access-token"];

	if (!token) {
		return res.status(403).send("A token is required for authentication");
	}
	try {
		const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
		req.user = decodedToken;

		const { firstName, lastName, displayName, email } = req.body;

		if (!(firstName && lastName && displayName && email)) {
			res.status(400).send("All fields are required");
		}
		const existingUser = User.findOne({ email });

		const user = await existingUser.updateOne(
			{
				email: email,
			},
			{
				firstName: firstName,
				lastName: lastName,
				displayName: displayName,
				email: email,
			}
		);

		res.status(200).send({
			success: "Profile updated successfully",
		});
	} catch (error) {
		return res.status(401).send(error);
	}
};
