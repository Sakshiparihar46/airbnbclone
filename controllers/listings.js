const Listing=require("../models/listing");

module.exports.index=async (req, res) => {
    const alllisting = await Listing.find({});
    res.render("./listing/index.ejs", { alllisting });
};

module.exports.renderNewForm= (req, res) => {
    res.render("./listing/new.ejs");
}

module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",
        populate:{path:"author"},
    }).populate("owner");
    if(!listing){req.flash("error","this listing does not exist!");
        res.redirect("/listings");
    }
    res.render("./listing/show.ejs", { listing });
}

module.exports.createListing=async(req, res) => {
    let listing = req.body.listing;
    const newlisting = new Listing(listing);
    newlisting.owner=req.user._id;
    await newlisting.save();
    req.flash("success","new Listing is created successfully!");
    res.redirect("/listings"); 
}

module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listing/edit.ejs", { listing });
}

module.exports.updateListing=async (req, res) => {
     let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success"," Listing is udated successfully!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
   const deleteListing= await Listing.findByIdAndDelete(id,{...req.body.listing});
   console.log(deleteListing);
   req.flash("success","Listing is deleted succesfully!");
   res.redirect("/listings");
}