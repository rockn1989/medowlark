const express = require("express");
const cluster = require('cluster');
const morgan = require('morgan');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const MongoDBStore = require('express-mongodb-session')(expressSession);
const { engine } = require("express-handlebars");
const multiparty = require('multiparty');
const handlers = require("./lib/handlers");
const flashMiddleware = require('./lib/middleware/flash');
const credentials = require('./.credentials.development.json');

const store = new MongoDBStore({
  uri: credentials.mongo.connectionString,
  collection: "mongoSessions",
  expiresKey: `_ts`,
});

store.on('error', (err) => {
  console.log(err);
});

require('./db');

const app = express();

switch(app.get('env')) {
  case 'development':
    app.use(morgan('dev'));
    break;
  case 'production':
    const stream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});
    app.use(morgan('combined', { stream }));
    break;
}

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(credentials.cookieSecret));
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: credentials.cookieSecret,
  name: `sessions_id`,
  store: store,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));

app.disable("x-powered-by");

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

app.use(flashMiddleware);

app.use((req, res, next) => {
  if (cluster.isWorker) {
    console.log(`Исполнитель ${cluster.worker.id} получил запрос`);
  }

  next();
  
});

app.get("/", handlers.home);

app.get("/about", handlers.about);

app.get("/newsletter-signup", handlers.newsletterSignup);
app.get("/newsletter-signup/thank-you", handlers.newsletterSignupThankYou);
app.get("/newsletter-archive", handlers.newsletterArchive);
app.post("/newsletter-signup/process", handlers.newsletterSignupProcess);
app.post('/api/newsletter-signup', handlers.api.newsletterSignup);

app.get('/contest/vacation-photo', handlers.vacationPhotoContest)
app.post('/api/vacation-photo-contest/:year/:month', (req, res) => {
  const form = new multiparty.Form();
  form.parse(req, (err, fields, files) => {
    handlers.api.vacationPhotoContest(req, res, fields, files);
  });
});

app.get('/vacations', handlers.listVacations);
app.get('/notify-me-when-in-season', handlers.notifyWhenInSeasonForm);
app.post('/notify-me-when-in-season', handlers.notifyWhenInSeasonProcess);

app.use(handlers.notFound);

app.use(handlers.serverError);

app.engine(
  ".hbs",
  engine({
    extname: ".hbs",
    helpers: {
      section: function (name, options) {
        if (!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
      },
    },
  })
);

app.set("view engine", ".hbs");

function startServer(port) {
  app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port} в режиме ${app.get('env')}`);
  });
}

if (require.main === module) {
  startServer(process.env.PORT || 3000);
} else {
  module.exports = startServer;
}
