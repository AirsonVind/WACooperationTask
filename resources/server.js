let express = require('express');

let router = require('./router');

function startServer() {
    let server = express();
    server.listen(2333);

    router.info_search(server);
}

startServer();