const express=require("express");
let router=express.Router();
const WrapAsync=require("../utils/WrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn}=require("../middleware.js");

const validateListing=(req,res,next)=>{
let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el) => el.message).join(",");       
         throw new ExpressError(400,errMsg);
    }
    else{next();}
}
//index route
router.get("/", WrapAsync(async (req, res) => {
    const alllisting = await Listing.find({});
    res.render("./listing/index.ejs", { alllisting });
}));

//new route
router.get("/new",isLoggedIn, (req, res) => {
    res.render("./listing/new.ejs");
});

//show route
router.get("/:id", WrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){req.flash("error","this listing does not exist!");
        res.redirect("/listings");
    }
    res.render("./listing/show.ejs", { listing });
}));

//create route
router.post("/",validateListing,isLoggedIn,WrapAsync( async (req, res) => {
    let listing = req.body.listing;
    const newlisting = new Listing(listing);
    await newlisting.save();
    req.flash("success","new Listing is created successfully!");
    res.redirect("/listings"); 
}));

//edit route
router.get("/:id/edit", WrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listing/edit.ejs", { listing });
}));

//update route
router.put("/:id",validateListing,isLoggedIn, WrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success"," Listing is udated successfully!");
    res.redirect("/listings");
}));

//delete route
router.delete("/:id",isLoggedIn, WrapAsync(async (req, res) => {
    let { id } = req.params;
   const deleteListing= await Listing.findByIdAndDelete(id,{...req.body.listing});
   console.log(deleteListing);
   req.flash("success","Listing is deleted succesfully!");
   res.redirect("/listings");
})
);

module.exports=router;