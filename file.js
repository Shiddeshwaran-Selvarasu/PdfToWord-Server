const {spawn} = require('child_process');
const express = require('express')
const path = require('path')
const fs = require('fs')
const multer = require('multer');
var upload = multer({dest: './'})

var app = express()

app.post('/upload', upload.single("pdf"), function (req, res) {

  console.log("Received file" + req.file.originalname);
  var statusMap = {};

  var src = fs.createReadStream(req.file.path);
  var dest = fs.createWriteStream('./' + req.file.originalname);

  src.pipe(dest);
  src.on('end', function () {
    fs.unlinkSync(req.file.path);
    statusMap['uploaded'] = true;
  });

  src.on('error', function (err) {
    statusMap['uploaded'] = false;
  });

  const python = spawn('python', ['./app.py', path.join(process.cwd(), req.file.originalname)]);

  python.stdout.on('data', function (data) {
    console.log(JSON.parse(data));
    statusMap['result'] = JSON.parse(data);
  });

  python.stdout.on('message', function (data) {
    console.log(data.toString());
    statusMap['log'] = data.toString();
  });

  python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    res.send(statusMap);
  });

})

app.get('/download', (req, res) => {
  let filePath = path.join('./', req.query.name + '.doc');
  console.log(filePath);
  res.download(filePath);
})

app.get('/clean', (req, res) => {
  let docFilePath = path.join('./', req.query.name + '.doc');
  let pdfFilePath = path.join('./', req.query.name + '.pdf');

  try {
    fs.unlinkSync(docFilePath);
    fs.unlinkSync(pdfFilePath);

    console.log("File is deleted.");
    res.send({status: true});
  } catch (error) {
    console.log(error);
    res.send({status: false});
  }

})

module.exports = app