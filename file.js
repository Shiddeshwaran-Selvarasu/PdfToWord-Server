const { spawn } = require('child_process');  // spawn a child process to run the [./app.py] python script
const express = require('express'); // express framework for api request handling
const fs = require('fs'); // file system module for reading and writing files

const path = require('path'); // path module for file path handling
const multer = require('multer');  // multer module for handling file uploads
var upload = multer({ dest: './uploads/' }) // multer current working directory configuration

var app = express();

const loger = fs.createWriteStream('./log.txt', { flags: 'a' }); // write stream (in append mode) for logging

app.post('/upload', upload.single("pdf"), function (req, res) {

  loger.write(`[${new Date().toUTCString()}]: Received file - ` + req.file.originalname + "\n");
  var statusMap = {};

  var src = fs.createReadStream(req.file.path);
  var dest = fs.createWriteStream('./uploads/' + req.file.originalname);

  src.pipe(dest);

  src.on('end', function () {
    fs.unlinkSync(req.file.path);
    statusMap['uploaded'] = true;
  });

  src.on('error', function (err) {
    statusMap['uploaded'] = false;
    res.send(statusMap);
    res.end();
  });

  const converter = spawn('python', ['./app.py', path.join(process.cwd() + "\\uploads\\", req.file.originalname)]);

  converter.stdout.on('data', function (data) {
    loger.write(`[${new Date().toUTCString()}]: Data - ` + JSON.stringify(JSON.parse(data)) + "\n");
    statusMap['result'] = JSON.parse(data);
  });

  converter.stdout.on('message', function (data) {
    loger.write(`[${new Date().toUTCString()}]: Data - ` + data.toString() + "\n");
    statusMap['log'] = data.toString();
  });

  converter.on('close', (code) => {
    loger.write(`[${new Date().toUTCString()}]: Child process exited with code ${code}` + "\n");
    res.send(statusMap);
  });

})

app.get('/download', (req, res) => {
  let filePath = path.join('./uploads/', req.query.name + '.doc');
  loger.write(`[${new Date().toUTCString()}]: Downloading file - ` + req.query.name + ".doc\n");
  res.download(filePath);
})

app.get('/clean', (req, res) => {
  let docFilePath = path.join('./uploads/', req.query.name + '.doc');
  let pdfFilePath = path.join('./uploads/', req.query.name + '.pdf');

  try {
    fs.unlinkSync(docFilePath);
    fs.unlinkSync(pdfFilePath);

    loger.write(`[${new Date().toUTCString()}]: Deleted files - ` + req.query.name + "\n");
    res.send({ status: true });
  } catch (error) {
    loger.write(`[${new Date().toUTCString()}]: Error deleting files - ` + req.query.name + "\n");
    res.send({ status: false });
  }

})

module.exports = { app, loger };