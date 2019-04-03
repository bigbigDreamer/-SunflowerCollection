const http = require('http');
const {util} = require('../utils');
module.exports.server = http.createServer((req, res, next) => {
    res.writeHead(200,{
        'Content-Type': 'text/html',
        'Transfer-Encoding':'utf8'
    });
    let data = util.createReadStream();
   /// console.info(data)
    res.write(data + '','utf8');
    res.end();
});
