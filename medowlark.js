var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({
    defaultLayout: 'main',
    helpers: {
        section: function (name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});
var fortune = require('./libs/fortune.js');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);


app.use(express.static(__dirname + '/publick'));

app.use(function (req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/tours/hood-river', function (req, res) {
    res.render('tours/hood-river');
});

app.get('/tours/request-group-rate', function (req, res) {
    res.render('tours/request-group-rate');
});

app.get('/tours/oregon-coast', function (req, res) {
    res.render('tours/oregon-coast');
});

app.get('/about', function (req, res) {
    res.render('about', {
        fortune: fortune.getFortune(),
        pageTestScript: 'qa/tests-about.js',
        style: req.query.style,
        userid: req.cookies,
        username: req.statusMessage,
    });
});

app.get('/test', function (req, res) {
    res.type('text/plain');
    res.send('Это текст');
});

app.get('/headers', function (req, res) {
    res.set('Content-type', 'text/plain');
    var s = '';
    for (var name in req.headers)
        s += name + ': ' + req.headers[name] + '\n';
    res.send(s);
});

/*  404 Page */
app.use(function (req, res) {
    res.status(404);
    res.render('404');
});


/* 500 Page */

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function () {
    console.log('Express start');
});

if (app.thing == null) console.log('Бе-е!');