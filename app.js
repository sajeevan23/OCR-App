// we declared all our imports
const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const app = express();
const fs = require('fs');
const multer = require('multer');
const {TesseractWorker} = require('tesseract.js');
const fileupload = require("express-fileupload");
app.use(fileupload());
// const worker = new TesseractWorker();
// const createWorker = require("tesseract.js");

const storage = multer.diskStorage({
    destination: (_req, _file,cb) => {
        cb(null, "./uploads");
    },
    filename: (_res, file, cb) => {
        cb(null, file.originalname);
    }
    
});
const upload = multer({storage: storage}).single("avatar");


app.set("view engine", "ejs");
app.use(express.static("public"));
//Router

app.get("/", (_req, res) => {
    res.render("index")
});

app.post("/upload", (req, res) => {
    upload(req, res, _err => {
        fs.readFile(`./uploads/${req.file.originalname}`, (err, Data) => {
            if(err) return console.log('This is your error', err);

            createWorker
            .recongnize(Data, "tam", {tessjs_Create_pdf: '1'})
            .progress(progress => {
                console.log(progress);
            })
            .then(_result => {
                // res.send(result.text);
                res.redirect('.download')
            })
            .finally(() => createWorker.terminate());
        });
    });
});

app.get('/download', (_req,res) => {
    const file = `${__dirname}/tesseract.js-ocr-result.pdf`;
    res.download(file)
})

const PORT = 4000 || process.env.PORT;
app.listen(PORT, () => console.log(`Hey Im running on port ${PORT}`));


