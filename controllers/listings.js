const Listing=require("../models/listing");

module.exports.index=async (req, res) => {
    let filter = {};
    if (req.query.country) {
        filter.country = req.query.country;
    }
    const alllisting = await Listing.find(filter);
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
    let url=req.file.path;
    let filename=req.file.filename;
    let listing = req.body.listing;
    const newlisting = new Listing(listing);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    await newlisting.save();
    req.flash("success","new Listing is created successfully!");
    res.redirect("/listings"); 
}

module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        res.flash("error","listing you requested for does not exist!");
        res.redirect("/listings");
    }

    let original_imageUrl=listing.image.url;
    original_imageUrl=original_imageUrl.replace("/upload","/upload/h_150,w_250");
    res.render("./listing/edit.ejs", { listing,original_imageUrl});
}

module.exports.updateListing=async (req, res) => {
     let { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if( typeof req.file!="undefined"){
     let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();}

    req.flash("success"," Listing is updated successfully!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
   const deleteListing= await Listing.findByIdAndDelete(id,{...req.body.listing});
   console.log(deleteListing);
   req.flash("success","Listing is deleted succesfully!");
   res.redirect("/listings");
}