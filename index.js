var http = require('http');
const express = require('express');
const app = express();
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const helmet = require('helmet');
require("dotenv-safe").config();
var jwt = require('jsonwebtoken');

app.use(logger('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request
app.get('/', verifyJWT, (req, res, next) => {
    resposta = ""
    if(req.query.um && req.query.dois && req.query.tres && req.query.quatro) {
        processado = [];
        processado.push( parseInt(req.query.um) * 2 );
        processado.push( parseInt(req.query.dois) * 2 );
        processado.push( parseInt(req.query.tres) * 2 );
        processado.push( parseInt(req.query.quatro) * 2 );
        resposta = "Processado: " + processado;
    } else {
        resposta = "Adicione valores nos parametros um, dois, tres e quatro."
    }
    res.status(200).send(resposta);
})

// Login
app.post('/login', (req, res, next) => {
    // Autenticacao
    if(req.body.user === 'admin' && req.body.pwd === 'admin'){
        const payload = { "user": "admin" }; // poderia ser qualquer coisa. nao seguro
        var token = jwt.sign(payload, process.env.SECRET, {
            expiresIn: 300 // expira em 5min
        });
        res.status(200).send({ auth: true, token: token });
    }
    
    res.status(500).send('Login inválido!');
})

// Logout
app.get('/logout', function(req, res) {
    res.status(200).send({ auth: false, token: null });
});

// Autorizacao
function verifyJWT(req, res, next){
    var token = req.headers['access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        
        // se tudo estiver ok, salva no request para uso posterior
        req.user = decoded.user; // isso estava no payload
        next();
    });
}

var server = http.createServer(app);
server.listen(3000);    
console.log("Ok");