const express = require("express");
const bcrypt = require("bcrypt");
const { User, validationRegister: validation } = require("../models/user");
const config = require("config");

const router = express.Router();
router.post("/", (req, res) => {
	let error = validation(req.body);
	if (error[0]) {
		res.send(error);
		return;
	}
	registerUser(req.body, res);
});

async function registerUser(user, res) {
	let [userEmail] = await User.find({ email: user.email });
	if (userEmail) res.send({ error: "This email is already used" });
	if (!userEmail) {
		hashingPasswordAndStoreUser(user, res);
	}
}

function hashingPasswordAndStoreUser(user, res) {
	const { username, password: plainPassword, email } = user;
	const saltRounds = parseInt(config.get("salt"));
	bcrypt.genSalt(saltRounds, function (err, salt) {
		bcrypt.hash(plainPassword, salt, function (err, hash) {
			let newUser = new User({
				username,
				email,
				password: hash,
			});
			res.send(newUser.generateUserToken());
			newUser.save().then(() => console.log("saved"));
		});
	});
}

module.exports = router;
