const fs = require('fs'); // file system module for file handling

const loger = fs.createWriteStream('./log.txt', { flags: 'a' }); // write stream (in append mode) for logging

async function writeLog(data) {
  loger.write(`[${new Date().toUTCString()}]: ${data}` + "\n");
}

module.exports = writeLog;