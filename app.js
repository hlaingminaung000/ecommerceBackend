const express = require("express");
const mongoose = require("mongoose");
const app = express();
const productRouter = require("./routers/productRouter.js");
const registerRouter = require("./routers/registerRouter.js");
const LoginRouter = require("./routers/loginRouter.js");
const userProfileEditRouter = require("./routers/userProfileEditRouter.js");
const sendReceiptRouter = require("./routers/sendReceiptRouter.js");
const receiveContactRouter = require("./routers/receiveContact");

app.use(express.json());
app.use(function (req, response, next) {
	response.setHeader("Access-Control-Allow-Origin", "*");
	response.setHeader("Access-Control-Allow-Credentials", "true");
	response.setHeader(
		"Access-Control-Allow-Methods",
		"GET,HEAD,OPTIONS,POST,PUT"
	);
	response.setHeader(
		"Access-Control-Allow-Headers",
		"Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
	);
	next();
});
app.use("/api/products", productRouter);
app.use("/api/register", registerRouter);
app.use("/api/login", LoginRouter);
app.use("/api/userProfileEdit", userProfileEditRouter);
app.use("/api/sendReceipt", sendReceiptRouter);
app.use("/api/receiveContact", receiveContactRouter);

app.listen(process.env.PORT || 3001, () => {
	console.log("Listening to Port 3001...");
});
const url =
	process.env.NODE_ENV === "production"
		? "mongodb+srv://HlaingMinAung:aliabdht123@cluster0.xfksl.mongodb.net/ecommerce?retryWrites=true&w=majority"
		: "mongodb://localhost/nodeProject";
mongoose.connect(
	url,
	{ useUnifiedTopology: true, useNewUrlParser: true },
	(err) => {
		console.log("Connected to Mongodb...");
		if (err) console.log(err);
	}
);
