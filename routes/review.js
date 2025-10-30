const express=require("express");
let router=express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const WrapAsync=require("../utils/WrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");

const validateReviews=(req,res,next)=>{
let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el) => el.message).join(",");       
         throw new ExpressError(400,errMsg);
    }
    else{next();}
}

//review post route
router.post("/",validateReviews,WrapAsync(async(req,res)=>{
   let listing=await Listing.findById(req.params.id);
   let newreview=new Review(req.body.review);

    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
    
}));

//delete review route
router.delete("/:reviewId",WrapAsync(async(req,res)=>{
let{id,reviewId}=req.params;
await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
await Review.findByIdAndDelete(reviewId);
res.redirect(`/listings/${id}`);
}));
module.exports=router;