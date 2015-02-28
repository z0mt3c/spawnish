var fs = require('fs');

try {
    fs.writeSync(3, JSON.stringify({test: 'test'}) + '\n');
} catch (e) {}
