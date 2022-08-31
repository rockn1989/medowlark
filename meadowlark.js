const express = require("express");
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const { engine } = require("express-handlebars");
const multiparty = require('multiparty');
const handlers = require("./lib/handlers");
const flashMiddleware = require('./lib/middleware/flash');
const credentials = require('./.credentials.development.json');

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(credentials.cookieSecret));
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: credentials.cookieSecret,
  name: `sessions_id`
}));

app.disable("x-powered-by");

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

app.use(flashMiddleware);

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

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
  });
} else {
  module.exports = app;
}
