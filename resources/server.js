const express = require('express');
const router = require('./router');


let server = express();
server.listen(2333);
router(server);
