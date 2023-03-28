const { app , loger} = require('./file')

app.listen(4001, () => {
  loger.write(`[${new Date().toUTCString()}]: Server Running on port 4001.......\n`);
  console.log('Server Running on port 4001.......')
})

process.on('uncaughtException', function (err) {
  loger.write(`[${new Date().toUTCString()}]: Caught exception: ` + err + "\n");
});

process.on('SIGINT', () => {
  loger.write(`[${new Date().toUTCString()}]: Server stopped on interrupt signal ctrl+c \n`);
  process.exit();
});  // CTRL+C

process.on('SIGQUIT', () => {
  loger.write(`[${new Date().toUTCString()}]: Server stopped on quit signal` + "\n");
  process.exit();
}); // Keyboard quit

process.on('SIGTERM', () => {
  loger.write(`[${new Date().toUTCString()}]: Server stopped on terminate signal` + "\n");
  process.exit();
}); // `kill` command