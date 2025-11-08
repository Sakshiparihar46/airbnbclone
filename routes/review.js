const express=require("express");
let router=express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const WrapAsync=require("../utils/WrapAsync.js");
const Review=require("../models/review.js");
const {validateReviews}=require("../middleware.js");

//review post route
router.post("/",validateReviews,WrapAsync(async(req,res)=>{
   let listing=await Listing.findById(req.params.id);
   let newreview=new Review(req.body.review);

    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    req.flash("success","new review is added successfully!");
    res.redirect(`/listings/${listing._id}`);
    
}));

//delete review route
router.delete("/:reviewId",WrapAsync(async(req,res)=>{
let{id,reviewId}=req.params;
await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
await Review.findByIdAndDelete(reviewId);
req.flash("success","review is deleted successfully!");
res.redirect(`/listings/${id}`);
}));
module.exports=router;