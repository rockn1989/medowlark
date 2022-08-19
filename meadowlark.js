const express = require("express");
const { engine } = require("express-handlebars");
const handlers = require("./lib/handlers");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");

app.disable("x-powered-by");

app.get("/", handlers.home);

app.get("/about", handlers.about);

app.use(handlers.notFound);

app.use(handlers.serverError);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
  });
} else {
  module.exports = app;
}
