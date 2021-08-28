const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Products = mongoose.model(
	"products",
	new mongoose.Schema({
		itemName: String,
		itemNameDetail: String,
		money: Number,
		image: [String],
		stock: Number,
		size: [String],
		release: String,
		type: String,
		exclusive: Boolean,
		fav: Boolean,
		productDetail: String,
	})
);

router.get("/", (req, res) => {
	getProducts(res);
});
async function getProducts(res) {
	const products = await Products.find();
	res.header("Access-Control-Allow-Origin", "*").send(products);
}
module.exports = router;
