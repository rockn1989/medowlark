"use strict";

const getFortune = require("./fortune");

exports.api = {};

exports.home = (req, res) => res.render("home");

exports.about = (req, res) => {
  res.render("about", { fortunes: getFortune() });
};

exports.newsletterSignup = (req, res) => {
  res.render("newsletter-signup", { csrf: "Токен CSRF" });
};

exports.newsletterSignupProcess = (req, res) => {
  console.log("CSRF token (from hidden form field): " + req.body._csrf);
  console.log("Name (from visible form field): " + req.body.name);
  console.log("Email (from visible form field): " + req.body.email);
  res.redirect(303, "/newsletter-signup/thank-you");
};

exports.newsletterSignupThankYou = (req, res) =>
  res.render("newsletter-signup-thank-you");

exports.api.newsletterSignup = (req, res) => {
  console.log(req.body);
  console.log('CSRF token (from hidden form field): ' + req.body._csrf);
  console.log('Name (from visible form field): ' + req.body.name);
  console.log('Email (from visible form field): ' + req.body.email);
  res.send({ result: 'success' });
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

exports.notFound = (req, res) => res.status(404).render("404");

/* eslint-disable no-unused-vars */
exports.serverError = (err, req, res, next) =>
  res.status(500).render("500", { error: err });
/* eslint-enable no-unused-vars */
