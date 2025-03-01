const express = require("express");
const app = express();
app.use(express.static("public"));
const multer = require("multer");
const fs = require("fs");
const ejs = require("ejs");



const storage = multer.diskStorage({
    destination:function(req,file,cb)
    {
        cb(null , "uploads/")
    },
    filename : function(req,file,cb){
        cb(null,file.originalname);
    }
})

const upload = multer({ storage : storage , fileFilter : function (req, file , cb){
    if(file.mimetype == "image/jpeg" || file.mimetype == "image/png"){ 
        cb(null, true);
    }
}})
app.use(express.static("uploads"));



app.post("/", upload.array("image" , 5), function (req, res) {
    console.log(req.files[0].filename);
    WriteFile(req.files[0].filename, function () {
        res.send(`file Uploaded`);
    }) 

})

app.set("view engine", "ejs");
app.get("/home", function (req, res) {
    ReadFile(function (data) {
        res.render("home", { url: data }) 
    })
})
app.listen(3000, () => {
    console.log("server is running at port 3000");
})

function ReadFile(callBack) {
    fs.readFile("./db.txt", "utf-8", function (err, data) {
        callBack(data);
    })
}

function WriteFile(data, callBack) {
    fs.writeFile("./db.txt",data, function (err, data) {
        callBack(data);
    })
}