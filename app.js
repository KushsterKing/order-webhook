var express = require('express');
var path = require('path');
var cors = require('cors');
var app = express();
let io = require('./app/_helpers/socket');
let bodyParser = require('body-parser');

const swaggerUiExpress  = require('swagger-ui-express');

const swaggerDocument = require('./swagger.json');
// var fileUpload=require('express-fileupload');

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb'}));

// app.use(express.static(path.join(__dirname, '/public')));

var credentials = {
    userName: "order-webhook",
    password: "JHG()95^h&JUiASX"
};
var realm = 'Basic Authentication';

function authenticationStatus(resp) {
    resp.writeHead(401, { 'WWW-Authenticate': 'Basic realm="' + realm + '"' });
    resp.end('Authorization is needed');

}

app.use('/swagger',(request, response, next) => {
    var authentication, loginInfo;
    if (!request.headers.authorization) {
        authenticationStatus (response);
        return;
    }
    authentication = request.headers.authorization.replace(/^Basic/, '');
    authentication = (new Buffer(authentication, 'base64')).toString('utf8');
    loginInfo = authentication.split(':');
    if (loginInfo[0] === credentials.userName && loginInfo[1] === credentials.password) {
        next()
    }else{
        authenticationStatus (response);
    }

});

app.use('/swagger', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerDocument));

app.use(cors());
app.set('trust proxy', true);

// app.use(fileUpload({
//     useTempFiles : true,
//     tempFileDir : '/tmp/'
// }));


// app.use(fileUpload({
//     limits: { fileSize: 50 * 1024 * 1024 },
// }));

require('./app/routes')(app);


module.exports = app;
