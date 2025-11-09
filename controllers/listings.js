const Listing=require("../models/listing");

module.exports.index=async (req, res) => {
    const alllisting = await Listing.find({});
    res.render("./listing/index.ejs", { alllisting });
};