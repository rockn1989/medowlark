const express = require("express");
const { engine } = require("express-handlebars");
const getFortune = require("./lib/fortute");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about", { fortunes: getFortune() });
});

app.use((req, res) => {
  res.status(404);
  res.render("404");
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500);
  res.render(500);
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
