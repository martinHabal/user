const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const http = require('http');
const path = require('path');
const app = express();
const PORT = 80;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;
// const oneDay = 1000 * 6

//session middleware
app.use(sessions({
    secret: "thisismysecrctekey",//klíč používaný k ověření relace
    saveUninitialized: true,//relace je vytvorena ale neupravena
    cookie: { maxAge: oneDay },//doba vypršení platnosti cookie. Zmizi z prohlizece SID
    resave: false//Umožňuje uložit relaci zpět do úložiště relací, i když relace nebyla během požadavku nikdy změněna. Souvislost s dva paralelní požadavky na server
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', function (req, res) {

    res.render('login');
});


app.get('/set', function (req, res) {
    req.session.user = { name: 'Chetan' };
    res.send('Session set');
});

app.get('/statement', function (req, res) {

    if (req.session.user) {
        let data = req.session.user
        res.render('statement', { data });
    } else {
        res.send("musíš se přihlásit");
    }
});

app.post('/statement', function (req, res) {
    console.log(req.body.user)
    req.session.user = { name: req.body.user };
    if (req.session.user) {
        let data = req.session.user
        res.render('statement', { data });
    } else {
        res.send("musíš se přihlásit");
    }
});

app.get('/timetable', function (req, res) {
    if (req.session.user) {

        res.send(req.session.user);
    } else {
        res.send("musíš se přihlásit");
    }
});

http.createServer(app).listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`);
});