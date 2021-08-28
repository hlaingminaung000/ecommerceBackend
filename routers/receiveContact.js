const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();
router.post("/", (req, res) => {
	console.log(req.body);
	const { first, last, email, message } = req.body;
	let transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: "dragonboy.uhuh123@gmail.com",
			pass: "emmawatson123",
		},
	});
	transporter
		.sendMail({
			from: "dragonboy.uhuh123@gmail.com",
			to: "dragonboy.uhuh123@gmail.com",
			subject: `Contact from ${first} ${last}`,
			text: "Hello world?",
			html: `<div><h3>Email=>> ${email}</h3><h3>message=>> ${message}</h3></div>`,
		})
		.then((info) => console.log(info))
		.catch((err) => console.log(err));
});

module.exports = router;
