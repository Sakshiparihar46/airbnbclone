const express = require('express');
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listing = require("./routes/listing.js");
const review = require("./routes/review.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname, "/public")));
app.use("/listings", listing);
app.use("/listings/:id/reviews", review);

main().then(() => console.log("connection successful")).catch((err) => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}

app.use((req, res, next) => {
    next(new ExpressError(404, "page not found"));
});
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong!" } = err;
    res.status(statusCode).render("./listing/error.ejs", { message });
    // res.status(statusCode).send(message);
});

app.get("/", (req, res) => {
    res.send("hi i am sakshi");
});

app.listen(8080, () => {
    console.log("server is listening on port 8080");
});