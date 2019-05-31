let express = require('express');

let router = require('./router');

function startServer() {
    let server = express();
    server.listen(2333);
    server.get('/',function (req,res) {
        res.send('ok');
        console.log('server connected');
    })
    router.register(server);
}

startServer();