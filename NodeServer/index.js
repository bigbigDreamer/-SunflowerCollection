const {hostname, port} = require('./src/config');
const chalk = require('chalk') ;
const {server} = require( './src/main');

server.listen(port, hostname, () => {
    const addr = `Serve at:${hostname}:${[port]}`;
    console.info(chalk.bgGreen(addr));
});