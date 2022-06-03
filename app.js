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
    },s
    filename: (res, file, cb) => {
        cb(null, file.originalname);
    }
    
});
const upload = multer({storage: storage}).single("avatar");


app.set("view engine", "ejs");
app.use(express.static("public"));
//Router

app.get("/", (req, res) => {
    res.render("index")
});

app.post("/upload", (req, res) => {
    upload(req, res, err => {
        fs.readFile(`./uploads/${req.file.originalname}`, (err, Data) => {
            if(err) return console.log('This is your error', err);

            worker
            .recongnize(Data, "eng", {tessjs_Create_pdf: '1'})
            .progress(progress => {
                console.log(progress);
            })
            .then(result => {
                // res.send(result.text);
                res.redirect('.download')
            })
            .finally(() => worker.terminate());
        });
    });
});

app.get('/download', (req,res) => {
    const file = `${__dirname}/tesseract.js-ocr-result.pdf`;
    res.download(file)
})

const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => console.log('Hey Im running on port ${PORT}'));


