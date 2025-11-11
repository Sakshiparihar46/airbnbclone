if(process.env.NODE_ENV!="production"){
require('dotenv').config();
}
const express = require('express');
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listing = require("./routes/listing.js");
const review = require("./routes/review.js");
const user=require("./routes/user.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname, "/public")));


const sessionOptions={
    secret:"my super secret code",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    },
};

app.use(session(sessionOptions));
app.use(flash());

// initialize passport 
app.use(passport.initialize());
app.use(passport.session());

// make current user available in all templates
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

// Fetch unique countries for autocomplete
app.use(async (req, res, next) => {
    try {
        const Listing = require("./models/listing");
        const listings = await Listing.find({});
        const uniqueCountries = [...new Set(listings.map(l => l.country).filter(c => c))];
        res.locals.uniqueCountries = uniqueCountries.sort();
        next();
    } catch (err) {
        res.locals.uniqueCountries = [];
        next();
    }
});

app.use("/listings", listing);
app.use("/listings/:id/reviews", review);
app.use("/",user);

main().then(() => console.log("connection successful")).catch((err) => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}

app.use((req, res, next) => {
    next(new ExpressError(404, "page not found"));
});
//error handle
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong!" } = err;
    res.status(statusCode).render("./listing/error.ejs", { message });
});



app.listen(8080, () => {
    console.log("server is listening on port 8080");
});