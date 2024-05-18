import express from "express";
import fs from "fs";

const PORT=4000;

function logMiddleware(req,res,next){
fs.appendFileSync("logFile.log",`Request recieverd from ${req.url} with ${req.method} method from  ${req.ip} address at ${new Date} \n`);
next();
}
const app=express();

app.use(logMiddleware);

app.get("/food",(req,res)=>{
    res.status(200).json({
        message:"Food Log is been added do check"
    })
})

app.use('/*',(req,res)=>{
    res.status(400).json({
        message:"Path inavlid"
    })
})


app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})