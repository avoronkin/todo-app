function returnJson(data, status) {
    var status = status || 200;
    var data = data || null;

    this.res.writeHead(status, {
        'Content-Type': 'application/json'
    });
    this.res.end(JSON.stringify(data));
}

function getErrorStatus(error) {
    var status = 500;
    var mes = error.message;

    if (mes === 'Not found') {
        status = 404;
    }

    return status;
}

module.exports = function (promise, status) {
    var self = this;

    promise.then(function (data) {
        returnJson.bind(self)(data, status);
    }).fail(function (error) {
        status = getErrorStatus(error);
        returnJson.bind(self)({
            error: error.message
        }, status);
    });
};
