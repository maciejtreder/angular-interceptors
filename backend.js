const express = require('express');
const cors = require('cors')

function makeToken(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }


let app = express();

app.use(cors());

let token = makeToken(10);
const refreshToken = 'refresh';

app.get('/info', (req, res) => {
    if (req.headers.authorization == token) {
        res.send({name: "Foo", surname: "Bar"});
    } else {
        res.send({name: "unknown", surname: "user"});
    }
});

app.post('/login', (req, res) => {
    res.send({authToken: token, refreshToken: refreshToken});
});

app.post('/refresh', (req, res) => {
    if(req.headers.refresh == refreshToken) {
        res.send({authToken: token, refreshToken: refreshToken});
    } else {
        res.sendStatus(401);
    }
});

app.get('/secret', (req, res) => {
    if (req.headers.authorization == token) {
        res.send({data: "this is secret!"});
    } else {
        res.sendStatus(401);
    }
});

app.get('/invalidateAuthToken', (req, res) => {
    token = makeToken(10);
    res.send({});
});


app.listen(8080, () => {
    console.log('App running on localhost:8080');
});