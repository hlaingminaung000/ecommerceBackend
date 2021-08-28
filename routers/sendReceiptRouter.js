const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
const nodemailer = require("nodemailer");
const router = express.Router();
const hbs = require("nodemailer-handlebars");
const Handlebars = require("handlebars");

router.post("/", (req, res) => {
	console.log(req.body);
	getUserAndSendEmail(req, res);
});

function getUserAndSendEmail(req, res) {
	try {
		const { token, purchasedProducts, phAndAddress } = req.body;
		const decodedjwt = jwt.verify(token, config.get("jwtSecretKey"));
		let transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: "dragonboy.uhuh123@gmail.com",
				pass: "emmawatson123",
			},
		});
		let transporter2 = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: "dragonboy.uhuh123@gmail.com",
				pass: "emmawatson123",
			},
		});
		transporter.use(
			"compile",
			hbs({
				viewEngine: {
					extname: ".handlebars",
					layoutsDir: "./views/",
					defaultLayout: "index",
				},
				viewPath: "./views/",
			})
		);
		transporter2.use(
			"compile",
			hbs({
				viewEngine: {
					extname: ".handlebars",
					layoutsDir: "./views/",
					defaultLayout: "emailForAdmin",
				},
				viewPath: "./views/",
			})
		);
		transporter
			.sendMail({
				from: "dragonboy.uhuh123@gmail.com",
				to: decodedjwt.email,
				subject: "My Receipt",
				text: "Hello world?",
				template: "index",
				context: {
					purchasedProducts: purchasedProducts,
					CalculateTota: CalculateTotal(
						purchasedProducts.count,
						purchasedProducts.money
					),
					Combin: Combine(purchasedProducts),
					ta: tax(purchasedProducts),
					tota: total(purchasedProducts),
				},
			})
			.then((info) => console.log(info))
			.catch((err) => console.log(err));
		transporter2
			.sendMail({
				from: "dragonboy.uhuh123@gmail.com",
				to: "dragonboy.uhuh123@gmail.com",
				subject: `Order form ${decodedjwt.username}`,
				text: "Hello world?",
				template: "emailForAdmin",
				context: {
					purchasedProducts: purchasedProducts,
					CalculateTota: CalculateTotal(
						purchasedProducts.count,
						purchasedProducts.money
					),
					Combin: Combine(purchasedProducts),
					ta: tax(purchasedProducts),
					tota: total(purchasedProducts),
					userinfo: { username: decodedjwt.username },
					phAndAddress,
				},
			})
			.then((info) => console.log(info))
			.catch((err) => console.log(err));
		res.send("hello");
	} catch (err) {
		console.log(err);
	}
}
Handlebars.registerHelper("loud", function (count, money) {
	return count * money + "  " + "Kyat";
});
function CalculateTotal(count, money) {}
function Combine(purchasedProducts) {
	let combine = 0;
	for (let i of purchasedProducts) {
		combine += i.count * i.money;
	}
	return combine;
}
function tax(purchasedProducts) {
	let tax = Combine(purchasedProducts) * (1.5 / 100);
	return tax;
}
function total(purchasedProducts) {
	return Combine(purchasedProducts) + tax(purchasedProducts);
}

module.exports = router;
