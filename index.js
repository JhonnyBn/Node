/**
 * Exemplo de Servidor com Autenticação em Node através de JSON Web Tokens.
 *
 * @file   This file defines the server.
 * @author JhonnyBn
 */

const http = require('http'); // servidor
const express = require('express'); // framework express pra criar o servidor
const cookieParser = require('cookie-parser'); // cookie parser
const morgan = require('morgan'); // imprime logs dos requests no servidor
const helmet = require('helmet'); // camadas de seguranca adicional
require("dotenv-safe").config(); // importa o SECRET como variavel de ambiente
const jwt = require('jsonwebtoken'); // usa o SECRET para criar credenciais de login

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet());

// Rota de login
app.post('/login', (req, res, next) => {
    // Autenticacao
    if(req.body.user === 'admin' && req.body.pwd === 'admin'){
        const payload = { id: 1, user: "admin" }; // poderia ser qualquer coisa. nao seguro
        var token = jwt.sign(payload, process.env.SECRET, {
            expiresIn: 300 // token expira em 5min
        });
        res.status(200).send({ auth: true, token: token });
    }
    
    res.status(500).send('Login inválido!');
})

/**
 * Verifica o token do usuário
 * @function verifyJWT
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {undefined}
 */
function verifyJWT(req, res, next){
    var token = req.headers['access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        
        // se tudo estiver ok, salva oq estiver no payload no request para uso posterior
        req.id = decoded.id;
        req.user = decoded.user;
        next();
    });
}

// Rota segura padrão. Multiplica 4 parâmetros e retorna o resultado somente se o usuário estiver logado.
app.get('/', verifyJWT, (req, res, next) => {
    let resposta = [];
    if(req.query.um) resposta.push( parseInt(req.query.um) * 2 );
    if(req.query.dois) resposta.push( parseInt(req.query.dois) * 2 );
    if(req.query.tres) resposta.push( parseInt(req.query.tres) * 2 );
    if(req.query.quatro) resposta.push( parseInt(req.query.quatro) * 2 );
    
    res.status(200).send( JSON.stringify(resposta) );
})

var server = http.createServer(app);
server.listen(3000);    
console.log("Ok");