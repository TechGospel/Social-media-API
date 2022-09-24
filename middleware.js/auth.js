const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
	const token =
		req.body.token || req.query.token || req.headers["x-access-token"];

	if (!token) {
		return res.status(403).send("A token is required for authentication");
	}
	try {
		const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
		req.user = decodedToken;
		res.status(200).send("Verification successful");
	} catch (error) {
		return res.status(401).send("Invalid authentication token");
	}
	return next();
};

module.exports = verifyToken;
