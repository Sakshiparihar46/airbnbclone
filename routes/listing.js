const express=require("express");
let router=express.Router();
const WrapAsync=require("../utils/WrapAsync.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");

router.route("/")
.get(
    WrapAsync(listingController.index))
.post(
    validateListing,
    isLoggedIn,
    WrapAsync(listingController.createListing));

//new route
router.get(
    "/new", 
    isLoggedIn,
    listingController.renderNewForm);


router.route("/:id")
.put(
    validateListing,
    isLoggedIn,
    isOwner, 
    WrapAsync(listingController.updateListing))
.delete(
    isLoggedIn,
    isOwner, 
    WrapAsync(listingController.destroyListing));
  

//show route
router.get(
    "/:id",
    WrapAsync(listingController.showListing));

//edit route
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner, 
    WrapAsync(listingController.renderEditForm));

module.exports=router;