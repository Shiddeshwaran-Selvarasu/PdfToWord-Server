const app = require('./app.js');
const log = require('./loger.js');

app.listen(4001, () => {
  log("Server Running on port 4001.......");
  console.log('Server Running on port 4001.......')
})

process.on('uncaughtException', function (err) {
  log(`Caught exception: ${err} `);
});

process.on('SIGINT', () => {
  log("Server stopped on interrupt signal ctrl+c");
  process.exit();
});  // CTRL+C

process.on('SIGQUIT', () => {
  log("Server stopped on quit signal");
  process.exit();
}); // Keyboard quit

process.on('SIGTERM', () => {
  log("Server stopped on terminate signal");
  process.exit();
}); // `kill` command