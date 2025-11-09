const express=require("express");
let router=express.Router({mergeParams:true});
const WrapAsync=require("../utils/WrapAsync.js");
const {isLoggedIn,validateReviews,isreviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");

//review post route
router.post("/",
    isLoggedIn,
    validateReviews,
    WrapAsync(reviewController.createReview));

//delete review route
router.delete("/:reviewId",
    isLoggedIn,
    isreviewAuthor,
    WrapAsync(reviewController.destroyReview));
    
module.exports=router;