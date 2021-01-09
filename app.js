const express = require("express")
//express
const app = express()
//body-parser
app.use(express.json());
app.use(express.urlencoded());

//EJS
app.use(express.static("public"));
app.set("view engine", "ejs");

//routes
app.get("/", (req, res)=>{
    res.render("main");
});

app.get("/login", (req, res)=>{
    res.render("login_form");
});

app.get("/sign-up", (req, res)=>{
    res.render("sign_up");
});

app.get("/buy_car", (req, res)=>{
    res.render("buy_car");
});

app.get("/sell_car", (req, res)=>{
    res.render("sell_car");
});

app.post("/sell_car", (req, res)=>{
    const post = {
        user:
        {
            name: req.body.name,
            state: req.body.state,
            city: req.body.city,
            zipcode: req.body.zipcode,
            phone: req.body.phone,
            email: req.body.email
        },
        car:{
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
        }
    };
    console.log(post);
    res.redirect("/");
});


app.listen(3000, ()=>{
    console.log("Server started on port 3000....");
});
