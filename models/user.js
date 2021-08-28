const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
	username: String,
	password: String,
	email: String,
});
userSchema.methods.generateUserToken = function () {
	const registeredUser = {
		username: this.username,
		email: this.email,
	};
	const token = jwt.sign(registeredUser, config.get("jwtSecretKey"));
	return token;
};

const User = mongoose.model("users", userSchema);

const option = {
	errors: {
		wrap: {
			label: "",
		},
	},
};
const schemaRegister = Joi.object({
	username: Joi.string().required().label("Username"),
	email: Joi.string()
		.email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
		.label("Email"),
	password: Joi.string().alphanum().min(3).max(30).required().label("Password"),
});
function validationRegister(user) {
	const { error } = schemaRegister.validate(user, option);
	if (error) {
		let arr = [];
		for (let err of error.details) {
			arr.push(err.message);
		}
		return arr;
	}
	return [];
}
const schemaLogin = Joi.object({
	email: Joi.string()
		.email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
		.required(),
	password: Joi.string().required(),
});
function validationLogin(user) {
	let { error } = schemaLogin.validate(user, option);
	if (!error) return [];
	let arr = [];
	for (let errors of error.details) {
		arr.push(errors.message);
	}
	return arr;
}
module.exports.User = User;
module.exports.validationRegister = validationRegister;
module.exports.validationLogin = validationLogin;
