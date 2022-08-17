const express = require("express");
const { engine } = require("express-handlebars");
const app = express();

const port = process.env.PORT || 3000;
const fortunes = [
  "Conquer your fears or they will conquer you.",
  "Rivers need springs.",
  "Do not fear what you don't know.",
  "You will have a pleasant surprise.",
  "Whenever possible, keep it simple.",
];

app.use(express.static(__dirname + "/public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
  res.render("about", { fortunes: randomFortune });
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
