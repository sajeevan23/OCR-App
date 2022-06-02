// we declared all our imports
const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const app = express();
const fs = require('fs');
const multer = require('multer');
const {TesseractWorker} = require('tesseract.js');
const worker = new TesseractWorker();

const storage = multer.diskStorage({
    destination: (req, file,cb) => {
        cb(null, "./uploads");
    },
    filename: (res, file, cb) => {
        cb(null, file.originalname);
    }
    
});
const upload = multer({storage: storage}).single("avatar");


app.set("view engine", "ejs");

//Route 

app.get('/', (req,res) => {
    res.render('index')
});

app.post("/upload", (req, res) => {
    upload(req, res, err => {
        console.log(req.file);
    })
})

// start Up our server
const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => console.log(`Hey I'm running on port ❌💯✅ ${PORT}`));

