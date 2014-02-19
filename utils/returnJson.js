function returnJson(data, status) {
    var status = status || 200;
    var data = data || null;
    var contentType = 'application/json; charset=utf-8';
    var output = JSON.stringify(data);

    // console.log('req', this.req)
    if (this.req.query.callback) {
        contentType = 'application/javascript';
        output = this.req.query.callback + '(' + output + ')';
    }

    this.res.writeHead(status, {
        'content-type': contentType
    });
    this.res.end(output);
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
