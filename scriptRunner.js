const childProcess = require('child_process'); // spawn a child process to run the [./converter.py] python script
const path = require('path'); // path module for file path handling
const event = require('events'); // event module for event handling

const log = require('./loger.js');

const eventEmitter = new event.EventEmitter();

async function converter(file) {
    log(`Converting file - ${path.join(process.cwd() + "/uploads/" + file.originalname)}`);
    var converter = childProcess.exec(`sudo python3 ./converter.py ${path.join(process.cwd() + "/uploads/" + file.originalname)}`, (error, stdout, stderr) => {
        if (error) {
            eventEmitter.emit('error', error);
            return;
        }

        if (stderr) {
            eventEmitter.emit('stderr', stderr);
            return;
        }

        eventEmitter.emit('stdout', stdout);
    });

    converter.removeAllListeners('exit');
    converter.on('exit', (code) => {
        eventEmitter.emit('closed', code);
    });
}

module.exports = {
    convert: converter,
    events: eventEmitter
};