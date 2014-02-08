// var controllers = require('../controllers'); 
module.exports = {
    '/': {
        get: function () {
            this.res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            this.res.end('hello world');
        }
    }
};
