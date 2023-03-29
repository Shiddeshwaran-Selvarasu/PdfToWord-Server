const express = require('express'); // express module for handling http requests
const path = require('path'); // path module for file path handling
const multer = require('multer');  // multer module for handling file uploads
const fs = require('fs'); // file system module for file handling

const log = require('./loger.js');
const uploader = require('./uploader.js');
const runner = require('./scriptRunner.js');

const app = express();
const upload = multer({ dest: './uploads/' }) // multer current working directory configuration

app.post('/upload', upload.single("pdf"),async function (req, res) {
    log(`Received file - ${req.file.originalname}`);
    var statusMap = {};

    uploader.upload(req.file);

    uploader.events.once('uploaded', async function (status) {
        if (status) {
            statusMap['uploaded'] = true;
            runner.convert(req.file);

            runner.events.once('closed', function (status) {
                log(`Child process exited with code ${status}`);
                if(status == 1){
                    statusMap['converted'] = false;
                } else {
                    statusMap['converted'] = true;
                }
                res.send(statusMap);
            });
        } else {
            statusMap['uploaded'] = false;
            res.send(statusMap);
        }
    });
});

app.get('/download', async (req, res) => {
    let filePath = path.join('./uploads/', req.query.name + '.doc');
    res.download(filePath, function (err) {
        if (err) {
            log(`Error downloading file - ${req.query.name}.doc`);
        } else {
            log(`Downloaded file - ${req.query.name}.doc`);
        }
    });
});

app.get('/clean', async (req, res) => {
    let docFilePath = path.join('./uploads/', req.query.name + '.doc');
    let pdfFilePath = path.join('./uploads/', req.query.name + '.pdf');

    try {
        fs.unlinkSync(docFilePath);
        fs.unlinkSync(pdfFilePath);

        log(`Deleted files - ${req.query.name}.doc, ${req.query.name}.pdf`);
        res.send({ status: true });
        res.end();
    } catch (error) {
        log(`Error deleting files - ${req.query.name}.doc, ${req.query.name}.pdf`);
        res.send({ status: false });
        res.end();
    }
});

module.exports = app;