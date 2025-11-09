const express=require("express");
let router=express.Router();
const WrapAsync=require("../utils/WrapAsync.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
//index route
router.get(
    "/",
    WrapAsync(listingController.index));

//new route
router.get(
    "/new", 
    isLoggedIn,
    listingController.renderNewForm);

//show route
router.get(
    "/:id",
    WrapAsync(listingController.showListing));

//create route
router.post(
    "/",
    validateListing,
    isLoggedIn,
    WrapAsync(listingController.createListing));

//edit route
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner, 
    WrapAsync(listingController.renderEditForm));

//update route
router.put("/:id",
    validateListing,
    isLoggedIn,
    isOwner, 
    WrapAsync(listingController.updateListing));

//delete route
router.delete(
    "/:id",
    isLoggedIn,
    isOwner, 
    WrapAsync(listingController.destroyListing));

module.exports=router;