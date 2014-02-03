module.exports = function (err, data) {
    this.res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    this.res.end(JSON.stringify(data));
};
