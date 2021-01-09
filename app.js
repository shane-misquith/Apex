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


app.listen(3000, ()=>{
    console.log("Server started on port 3000....");
});
