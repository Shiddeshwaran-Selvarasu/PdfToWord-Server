const childProcess = require('child_process'); // spawn a child process to run the [./converter.py] python script
const path = require('path'); // path module for file path handling
const event = require('events'); // event module for event handling

const log = require('./loger.js');

const eventEmitter = new event.EventEmitter();

async function converter(file) {
    log(`Converting file - ${path.join(process.cwd() + "/uploads/" + file.originalname)}`);
    const converter = childProcess.exec(`sudo python3 ./converter.py ${path.join(process.cwd() + "/uploads/" + file.originalname)}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`error: ${error.message}`);
            return;
        }

        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }

        console.log(`stdout:\n${stdout}`);
    });
}

module.exports = {
    convert: converter,
    events: eventEmitter
};