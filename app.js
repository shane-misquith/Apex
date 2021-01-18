const express = require("express");
const md5 = require("md5");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
	destination: "public/uploads/images",
	filename: (req, file, cb) => {
		cb(
			null,
			file.fieldname + "-" + Date.now() + path.extname(file.originalname)
		);
	},
});

const upload = multer({
	storage: storage,
});

//mongoose
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/apexDB", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
//express
const app = express();
//body-parser
app.use(express.json());
app.use(express.urlencoded());
//EJS
app.use(express.static("public"));
app.set("view engine", "ejs");

let cur_usr = "";
//User-login &sign_up
const imageSchema = new mongoose.Schema({
	img1: String,
	img2: String,
	img3: String,
	img4: String,
	img5: String,
	img6: String,
});
const Image = new mongoose.model("Image", imageSchema);

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

const userDetail = new mongoose.model("userDetail", userDetailSchema);
const Car = new mongoose.model("Car", carSchema);
const User = new mongoose.model("User", userSchema);

//routes
app.get("/", (req, res) => {
	res.render("main");
});

app.get("/login", (req, res) => {
	res.render("login_form");
});

app.post("/login", (req, res) => {
	const username = req.body.username;
	const password = md5(req.body.password);

	User.findOne({ username: username }, (err, foundUser) => {
		if (err) console.log(err);
		else {
			if (foundUser) {
				if (password === foundUser.password) {
					cur_usr = username;
					res.redirect("/");
				}
			} else console.log("wrong  password");
		}
	});
});

app.get("/sign-up", (req, res) => {
	res.render("sign_up");
});

app.post("/sign-up", (req, res) => {
	const newUser = new User({
		username: req.body.username,
		password: md5(req.body.password),
	});
	newUser.save((err) => {
		if (err) console.log(err);
		else res.redirect("/");
	});
});

app.get("/buy_car/:b_ty", (req, res) => {
	const b_ty = req.params.b_ty;
	if (b_ty == "all") {
		User.find({}, (err, collection) => {
			res.render("buy_car", { post: collection });
		});
	} else {
		User.find({ "car.body_type": b_ty }, (err, collection) => {
			if (b_ty == "Station%20Wagon") b_ty = "Station Wagon";
			res.render("buy_car", { post: collection });
		});
	}
});

app.get("/sell_car", (req, res) => {
	res.render("sell_car");
});

app.get("/detail_view/:car", (req, res) => {
	const car_id = req.params.car;
	User.findOne({ "car._id": car_id }, (err, carDetail) => {
		console.log(carDetail);
		res.render("detail_view", { carInfo: carDetail });
	});
});

app.get("/remove_ad", (req, res) => {
	res.render("remove_ad");
});

app.listen(3000, () => {
	console.log("Server started on port 3000....");
});

app.post("/sell_car", upload.array("myFile"), (req, res) => {
	const user_detail = new userDetail({
		name: req.body.name,
		state: req.body.state,
		city: req.body.city,
		zipcode: req.body.zipcode,
		phone: req.body.phone,
		email: req.body.email,
	});
	user_detail.save();
	User.updateOne({ username: cur_usr }, { userInfo: user_detail }, (err) => {
		if (err) console.log(err);
	});

	const car = new Car({
		price: req.body.price,
		make: req.body.make,
		model: req.body.model,
		model_year: req.body.model_year,
		engine: req.body.engine,
		transmission: req.body.transmission,
		milage: req.body.milage,

		body_type: req.body.body_type,
		drivetrain: req.body.drivetrain,
		any_mod: req.body.modifications,
		ext_col: req.body.exterior_color,
		int_col: req.body.interior_color,
		prev_own: req.body.previous_owners,

		feature: req.body.features,
	});
	car.save();
	console.log(car);
	User.updateOne({ username: cur_usr }, { car: car }, (err) => {
		if (err) console.log(err);
	});

	const img_arr = req.files;

	const images = new Image({
		img1: "/uploads/images/" + req.files[0].filename,
		img2: "/uploads/images/" + req.files[1].filename,
		img3: "/uploads/images/" + req.files[2].filename,
		img4: "/uploads/images/" + req.files[3].filename,
		img5: "/uploads/images/" + req.files[4].filename,
		img6: "/uploads/images/" + req.files[5].filename,
	});
	images.save();
	console.log(images);
	User.updateOne({ username: cur_usr }, { img: images }, (err) => {
		if (err) console.log(err);
	});
	res.redirect("/");
});
