"use strict";

const getFortune = require("./fortune");

exports.home = (req, res) => res.render("home");

exports.about = (req, res) => {
  res.render("about", { fortunes: getFortune() });
};

exports.notFound = (req, res) => res.status(404).render("404");

/* eslint-disable no-unused-vars */
exports.serverError = (err, req, res, next) =>
  res.status(500).render("500", { error: err });
/* eslint-enable no-unused-vars */
