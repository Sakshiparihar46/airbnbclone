const express=require("express");
const app=express();
const users=require("./routes/user.js");
const posts=require("./routes/post.js");
const session=require("express-session");

app.use(session({secret:"mysupersecretstring",resave:false}));
app.get("/reqcount",(req,res)=>{
    res.send(`you sent a request X times`);
})

// app.get("/test",(req,res)=>{
//     res.send("test successful");
// })
app.use("/users",users);
app.use("/posts",posts);

app.listen(3000,()=>{
    console.log("server is listening on port 3000");
});