const express = require("express");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

const router = express.Router();
router.put("/", (req, res) => {
	console.log(req.body);
	getDbUserAndModified(res, req);
});
async function getDbUserAndModified(res, req) {
	try {
		const decodedjwt = jwt.verify(req.body.jwt, config.get("jwtSecretKey"));
		const { label, value } = req.body;
		const [user] = await User.find({ email: decodedjwt.email });
		if (label.toLowerCase() === "name") {
			user.username = value;
			res.send(user.generateUserToken());
		}
		if (label.toLowerCase() === "email") {
			user.email = value;
			res.send(user.generateUserToken());
		}
		if (label.toLowerCase() === "password") {
			const saltRounds = parseInt(config.get("salt"));
			console.log(saltRounds);
			bcrypt.hash(value, saltRounds, function (err, hash) {
				console.log(hash);
				user.password = hash;
				user.save().then(() => console.log("saved"));
				return;
			});
		}
		console.log(user);
		user.save().then(() => console.log("saved"));
	} catch (error) {
		res.status(401).send("Hey Stupid kid,don't steal other people information");
	}
}
module.exports = router;
