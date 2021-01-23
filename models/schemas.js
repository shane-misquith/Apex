const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const imageSchema = new mongoose.Schema({
	img1: String,
	img2: String,
	img3: String,
	img4: String,
	img5: String,
	img6: String,
});

const userDetailSchema = new mongoose.Schema({
	name: String,
	state: String,
	city: String,
	zipcode: Number,
	phone: Number,
	email: String,
});

const carSchema = new mongoose.Schema({
	price: Number,
	make: "String",
	model: "String",
	model_year: Number,
	engine: "String",
	transmission: "String",
	milage: Number,
	body_type: "String",
	drivetrain: "String",
	any_mod: "String",
	ext_col: "String",
	int_col: "String",
	prev_own: Number,
	feature: "String",
});

const userSchema = new mongoose.Schema({
	username: String,
	password: String,
	userInfo: userDetailSchema,
	car: carSchema,
	img: imageSchema,
});

userSchema.plugin(passportLocalMongoose);

module.exports = {
	Image: new mongoose.model("Image", imageSchema),
	Car: new mongoose.model("Car", carSchema),
	userDetail: new mongoose.model("userDetail", userDetailSchema),
	User: new mongoose.model("User", userSchema),
};
