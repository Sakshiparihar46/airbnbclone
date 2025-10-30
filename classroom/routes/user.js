const express=require("express");
const router=express.Router();

//users
//index route
router.get("/",(req,res)=>{
    res.send("get for users");
});

//show route
router.get("/:id",(req,res)=>{
    res.send("get for show users");
});

//post route
router.post("/",(req,res)=>{
    res.send("post for show users");
});

//delete route
router.delete("/:id",(req,res)=>{
    res.send("delete for users id");
});
module.exports=router;