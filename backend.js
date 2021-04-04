const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const join = require('path').join;
const cookieParser = require('cookie-parser');

const privateKey = fs.readFileSync(path.join(__dirname,'private.key'));
const publicKey = fs.readFileSync(path.join(__dirname,'public.key'));
let invalidatedTokens = [];
let app = express();

const distFolder = join(
  process.cwd(),
  'dist/angular-interceptors'
);

function generateRefreshToken(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function generateAuthToken() {
    return jwt.sign({
        name: "Foo Bar",
        privileges: ["see_secret"],
        exp: Math.floor(Date.now() / 1000) + (60 * 60)
    }, privateKey, {algorithm: 'RS256'});
}

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));
app.use(cookieParser());

const refreshToken = generateRefreshToken(10);

app.post('/login', (req, res) => {
    res.cookie('refresh', refreshToken, {httpOnly: true}).send({authToken: generateAuthToken()});
});

app.post('/refresh', (req, res) => {
    if(req.cookies.refresh == refreshToken) {
        res.send({authToken: generateAuthToken()});
    } else {
        res.sendStatus(401);
    }
});

app.get('/secret', (req, res) => {
    const token = req.headers.auth;
    let decoded = jwt.verify(token, publicKey);
    if (!invalidatedTokens.includes(token) && decoded.privileges.indexOf('see_secret') >= 0) {
        res.send({data: "this is secret!"});
    } else {
        res.sendStatus(401);
    }
});

app.get('/invalidateAuthToken', (req, res) => {
    invalidatedTokens.push(req.headers.auth);
    authToken = generateAuthToken();
    res.send({});
});

app.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
    })
);
  
app.use('/', express.static(distFolder));
app.use('/**', express.static(distFolder));

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(
    `Backend is runing on: http://localhost:${port}`
  );
});
