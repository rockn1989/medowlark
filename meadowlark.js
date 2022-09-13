const express = require("express");
const morgan = require('morgan');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const handlers = require("./lib/handlers");
const credentials = require('./.credentials.development.json');


require('./db');

const app = express();

app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000']
}));

switch(app.get('env')) {
  case 'development':
    app.use(morgan('dev'));
    break;
  case 'production':
    const stream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});
    app.use(morgan('combined', { stream }));
    break;
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(credentials.cookieSecret));

app.disable("x-powered-by");

const port = process.env.PORT || 3033;

app.use(express.static(__dirname + "/public"));

// api
const vhost = require('vhost');
app.get('/vacations', vhost('api.*', handlers.getVacationsApi));
app.get('/vacation/:sku', vhost('api.*', handlers.getVacationBySkuApi));
app.post('/vacation/:sku/notify-when-in-season', vhost('api.*', handlers.addVacationInSeasonListenerApi));
app.delete('/vacation/:sku', vhost('api.*', handlers.requestDeleteVacationApi));

app.use(handlers.notFound);

app.use(handlers.serverError);

function startServer(port) {
  app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port} в режиме ${app.get('env')}`);
  });
}

if (require.main === module) {
  startServer(port);
} else {
  module.exports = startServer;
}
