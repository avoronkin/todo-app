var _ = require('underscore');

var getClientRoutes = function(routingTable){
    var clientRoutes = {};

    _.each(routingTable, function (handler, route) {
        if (_.has(handler, 'get')) {
            clientRoutes[route] = handler.get;
        }
    });

    return clientRoutes;
};

var getServerRoutes = function (routingTable) {
    return routingTable;
};

module.exports = {
    getClientRoutes: getClientRoutes,
    getServerRoutes: getServerRoutes
};

