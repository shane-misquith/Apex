const express = require("express");
const multer = require("multer");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const storage = multer.diskStorage({
	destination: "public/uploads/images",
	filename: (req, file, cb) => {
		cb(
			null,
			file.fieldname + "-" + Date.now() + path.extname(file.originalname)
		);
	},
});

const upload = multer({ storage: storage });

//express
const app = express();

//body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//EJS
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(
	session({
		secret: "Apex systems",
		resave: false,
		saveUninitialized: false,
	})
);

app.use(passport.initialize());
app.use(passport.session());
//mongoose
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/apexDB", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const { Image, Car, userDetail, User } = require("./models/schemas");

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
	res.locals.isAuth = req.isAuthenticated();
	next();
});
//routes
app.get("/", (req, res) => {
	res.render("main");
});

app.get("/login", (req, res) => {
	res.render("login_form");
});

app.post("/login", (req, res) => {
	const user = new User({
		username: req.body.username,
		password: req.body.password,
	});

	req.login(user, (err) => {
		if (err) {
			console.log(err);
		} else {
			passport.authenticate("local")(req, res, () => {
				res.redirect("/");
			});
		}
	});
});

app.get("/logout", (req, res) => {
	req.logout();
	req.session.destroy();
	res.redirect("/");
});

app.get("/sign-up", (req, res) => {
	res.render("sign_up");
});

app.post("/sign-up", (req, res) => {
	User.register(
		{ username: req.body.username },
		req.body.password,
		(err, user) => {
			if (err) console.log(err);
			else {
				passport.authenticate("local")(req, res, () => {
					res.redirect("/");
				});
			}
		}
	);
});

app.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/");
});

app.get("/buy_car/:b_ty", (req, res) => {
	let user_ps = "";
	if (req.isAuthenticated()) user_ps = req.user.username;
	const b_ty = req.params.b_ty;
	if (b_ty == "all") {
		User.find({}, (err, collection) => {
			res.render("buy_car", { post: collection, user_ps: user_ps });
		});
	} else {
		User.find({ "car.body_type": b_ty }, (err, collection) => {
			if (b_ty == "Station%20Wagon") b_ty = "Station Wagon";
			res.render("buy_car", { post: collection });
		});
	}
});

app.get("/sell_car", (req, res) => {
	if (req.isAuthenticated()) res.render("sell_car");
	else res.redirect("/login");
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
	User.updateOne(
		{ username: req.user.username },
		{ userInfo: user_detail },
		(err) => {
			if (err) console.log(err);
		}
	);
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
	User.updateOne({ username: req.user.username }, { car: car }, (err) => {
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
	User.updateOne({ username: req.user.username }, { img: images }, (err) => {
		if (err) console.log(err);
	});
	res.redirect("/");
});

app.get("/detail_view/:car", (req, res) => {
	const car_id = req.params.car;
	User.findOne({ "car._id": car_id }, (err, carDetail) => {
		res.render("detail_view", { carInfo: carDetail });
	});
});

app.get("/remove_ad", (req, res) => {
	const user_id = req.user._id;
	User.findOne({ _id: user_id }, (err, post) => {
		res.render("remove_ad", { post: post });
	});
});

app.post("/remove_ad", (req, res) => {
	const user_id = req.user._id;
	User.findOne({ _id: user_id }, (err, post) => {
		User.updateOne(
			{ _id: user_id },
			{ $unset: { userInfo: "", car: "", img: "" } },
			(err, post) => {
				console.log(post);
			}
		);
		userDetail.deleteMany({ _id: post.img._id }, (err, post) => {
			console.log("sucesss");
		});
		Car.deleteMany({ _id: post.img._id }, (err, post) => {
			console.log("sucesss");
		});
		Image.deleteMany({ _id: post.img._id }, (err, post) => {
			console.log("sucesss");
		});
		res.redirect("/");
	});
});

app.listen(3000, () => {
	console.log("Server started on port 3000....");
});
