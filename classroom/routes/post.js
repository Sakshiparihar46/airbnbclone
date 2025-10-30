const express=require("express");
const router=express.Router();

//posts
//index route
router.get("/",(req,res)=>{
    res.send("get for post");
});

//show route
router.get("/:id",(req,res)=>{
    res.send("get for show post");
});

//post route
router.post("/",(req,res)=>{
    res.send("post for show post");
});

//delete route
router.delete("/:id",(req,res)=>{
    res.send("delete for post id");
});
module.exports=router;