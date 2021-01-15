const express = require("express")
const md5 = require("md5")

//mongoose
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/apexDB", { useNewUrlParser: true, useUnifiedTopology: true })
//express
const app = express()
//body-parser
app.use(express.json());
app.use(express.urlencoded());
//EJS
app.use(express.static("public"));
app.set("view engine", "ejs");

let cur_usr = "";
//User-login &sign_up


const userDetailSchema = new mongoose.Schema({
    name: String,
    state: String,
    city: String,
    zipcode: Number,
    phone: Number,
    email: String
});


const carSchema = new mongoose.Schema({
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
    feature: "String"
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    userInfo: userDetailSchema,
    car: carSchema
});

const userDetail = new mongoose.model("userDetail", userDetailSchema);
const Car = new mongoose.model("Car", carSchema);
const User = new mongoose.model("User", userSchema);



//routes
app.get("/", (req, res)=>{
    res.render("main");
});

app.get("/login", (req, res)=>{
    res.render("login_form");
});

app.post("/login", (req,res)=>{
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({username:username},(err, foundUser)=>{
            if(err) console.log(err);
            else{
                if(foundUser){
                    if(password===foundUser.password) {
                        console.log(cur_usr)
                        cur_usr = username;
                        console.log(cur_usr);
                        res.redirect("/");
                    }
                }
            }
    }
    );

});

app.get("/sign-up", (req, res)=>{
    res.render("sign_up");
});

app.post("/sign-up", (req,res)=>{
    const newUser = new User({
        username: req.body.username,
        password: md5(req.body.password)
    });
    newUser.save((err)=>{
        if(err) console.log(err);
        else res.redirect("/");
    });
});



app.get("/buy_car", (req, res)=>{
    res.render("buy_car");
});

app.get("/sell_car", (req, res)=>{
    res.render("sell_car");
});

app.post("/sell_car", (req, res)=>{

    const user_detail = new userDetail({
        name: req.body.name,
        state: req.body.state,
        city: req.body.city,
        zipcode: req.body.zipcode,
        phone: req.body.phone,
        email: req.body.email
    });
    user_detail.save();
    console.log(user_detail)
    User.updateOne({username:cur_usr},{userInfo: user_detail},(err)=>{
        if(err) console.log(err);
        else console.log("success");
    });

    const car = new Car({
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

        feature: req.body.features
    });
    car.save();
    console.log(car)
    User.updateOne({username:cur_usr},{car: car},(err)=>{
        if(err) console.log(err);
        else console.log("success");
    });
    res.redirect("/");
});


app.get("/detail_view", (req, res)=>{
    res.render("detail_view");
});

app.get("/remove_ad", (req, res)=>{
    res.render("remove_ad");
});

app.listen(3000, ()=>{
    console.log("Server started on port 3000....");
});
