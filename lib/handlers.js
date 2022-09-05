"use strict";
const db = require('../db');
const getFortune = require("./fortune");

const VALID_EMAIL_REGEX = new RegExp('^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@' +
  '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
  '(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$');

// fake "newsletter signup" interface
class NewsletterSignup {
  constructor({ name, email }) {
    this.name = name;
    this.email = email;
  }
  async save() {
    // some do this..
  }
}


exports.api = {};

exports.home = (req, res) => {
  req.session.userName = 'Artem';
  console.log(req.session);
  res.cookie('monster', 'ням-ням', {signed: true});
  res.render("home");
};

exports.about = (req, res) => {
  res.clearCookie('monster');
  res.render("about", { fortunes: getFortune(), name: req.session.userName });
};

exports.newsletterSignup = (req, res) => {
  res.render("newsletter-signup", { csrf: "Токен CSRF" });
};


exports.newsletterSignupProcess = (req, res) => {
  
  const name = req.body.name || '', email = req.body.email || '';

  if(!VALID_EMAIL_REGEX.test(email)) {
    req.session.flash = {
      type: 'danger',
      intro: 'Validation error!',
      message: 'The email address you entered was not valid.',
    };

    return res.redirect(303, '/newsletter-signup');
  }
  
  new NewsletterSignup({ name, email }).save()
    .then(() => {
      req.session.flash = {
        type: 'success',
        intro: 'Thank you!',
        message: 'You have now been signed up for the newsletter.',
      };
      return res.redirect(303, '/newsletter-archive');
    })
    .catch(()=> {
      req.session.flash = {
        type: 'danger',
        intro: 'Database error!',
        message: 'There was a database error; please try again later.',
      };
      return res.redirect(303, '/newsletter-archive');
    });
};

exports.newsletterSignupThankYou = (req, res) =>
  res.render("newsletter-signup-thank-you");

exports.api.newsletterSignup = (req, res) => {
  res.send({ result: 'success' });
};

exports.newsletterArchive = (req, res) => {
  res.render('newsletter-archive');
};

exports.vacationPhotoContest = (req, res) => {
  const now = new Date();
  res.render('contest/vacation-photo', { year: now.getFullYear(), month: now.getMonth() });
};

exports.api.vacationPhotoContest = (req, res, fields, files) => {
  console.log('field data: ', fields);
  console.log('files: ', files);
  res.send({ result: 'success' });
};

exports.listVacations = async (req, res) => {
  const vacations = await db.getVacations({ available: true });
  const currency = req.session.currency || 'USD';
  const context = {
    currency: currency,
    vacations: vacations.map(vacation => {
      return {
        sku: vacation.sku,
        name: vacation.name,
        description: vacation.description,
        inSeason: vacation.inSeason,
        price: vacation.price.toFixed(2),
        qty: vacation.qty,
      }
    }),
  }
  switch(currency) {
    case 'USD': context.currencyUSD = 'selected'; break;
    case 'GBP': context.currencyGBP = 'selected'; break;
    case 'BTC': context.currencyBTC = 'selected'; break;
  }
  res.render('vacations', context);
};

exports.notifyWhenInSeasonForm = (req, res) =>
  res.render('notify-me-when-in-season', { sku: req.query.sku });

exports.notifyWhenInSeasonProcess = async (req, res) => {
  const { email, sku } = req.body;
  await db.addVacationInSeasonListener(email, sku);
  return res.redirect(303, '/vacations');
};

exports.notFound = (req, res) => res.status(404).render("404");

/* eslint-disable no-unused-vars */
exports.serverError = (err, req, res, next) =>
  res.status(500).render("500", { error: err });
/* eslint-enable no-unused-vars */
