const fs = require('fs'); // file system module for file handling
const event = require('events'); // event module for event handling

const eventEmitter = new event.EventEmitter();

async function upload(file){
    const src = fs.createReadStream(file.path);
    var dest = fs.createWriteStream('./uploads/' + file.originalname);

    src.pipe(dest);

    src.once('end', function () {
        console.log('File uploaded successfully');
        fs.unlinkSync(file.path);
        eventEmitter.emit('uploaded', true);
    });

    src.once('error', function (err) {
        eventEmitter.emit('uploaded', false);
    });
}

module.exports = {
    upload: upload,
    events: eventEmitter
};