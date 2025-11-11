const express=require("express");
let router=express.Router();
const WrapAsync=require("../utils/WrapAsync.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({storage });


router.route("/")
.get(
    WrapAsync(listingController.index))
.post(
    isLoggedIn,
    validateListing,
    upload.single('listing[image]'),
    WrapAsync(listingController.createListing));
//new route
router.get(
    "/new", 
    isLoggedIn,
    listingController.renderNewForm);


router.route("/:id")
.put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'), 
    validateListing,
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