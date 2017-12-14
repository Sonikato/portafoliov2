const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const hbs = require('hbs');
const moment = require('moment');
var session = require('express-session')
//importar puerto, db y rutas
var port = process.env.PORT || 3001;
var routes = require('./routes/v1');

//mongoose.connect('mongodb://localhost:27017/nombreDB');

//init express
const app = express();

//configurando carpeta vista y template
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views'));
hbs.registerHelper('greaterThan', function (v1, v2, options) {
'use strict';
   if (v1>v2) {
     return options.fn(this);
  }
  return options.inverse(this);
});
hbs.registerPartials(__dirname + '/views/templates');

//configurando directorio publico
app.use(express.static(path.join(__dirname, '/public')));

//archivos estaticos
app.use('/css', express.static(path.join(__dirname, '/public/css')));
app.use('/img', express.static(path.join(__dirname, '/public/img')));
app.use('/js', express.static(path.join(__dirname, '/public/js')));

//middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet());
moment().format();
moment.locale('es');
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  }));
//helmet desactivando para que no detenten express (helmet)
app.disable('x-powered-by');

//router
app.use('/', routes);

app.listen(port, () => {
    console.log(`server listening on port ${port}`);
});
