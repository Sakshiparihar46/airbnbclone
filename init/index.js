const mongoose=require('mongoose');
const initData=require('./data.js');
const Listing=require("../models/listing.js");
main().then(() => console.log("connection successful with db")).catch((err) => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}
const initDB=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"690b9b7275a1646dba9659a5"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialiased");
}
initDB();