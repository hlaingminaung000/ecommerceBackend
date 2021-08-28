const express = require("express");
const bcrypt = require("bcrypt");
const { User, validationLogin: validation } = require("../models/user");

const router = express.Router();
router.post("/", (req, res) => {
	let [errors] = validation(req.body);
	if (errors) {
		res.send(errors);
		return;
	}
	loginUser(req.body, res);
});

async function loginUser(user, res) {
	let [dbUser] = await User.find({ email: user.email });
	if (dbUser) {
		bcrypt.compare(user.password, dbUser.password).then(function (result) {
			if (result) {
				res.send(dbUser.generateUserToken());
				return;
			} else {
				res.send({ error: "Invalid email or password" });
				return;
			}
		});
		return;
	}
	res.send({ error: "You need to register first" });
}

module.exports = router;
