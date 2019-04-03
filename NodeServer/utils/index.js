const fs = require('fs');

class readFile {

    createReadStream(url = './public/index.html') {
        return fs.readFileSync(url, {
            encoding: 'utf8',
        });

    }
}

// new readFile().createReadStream()
module.exports.util = new readFile();