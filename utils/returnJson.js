module.exports = function (obj) {
    this.res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    this.res.end(JSON.stringify(obj));
};
