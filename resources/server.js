const express = require('express');
const router = require('./router');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const session = require('express-session');


let server = express();
server.listen(2333);
router(server);
