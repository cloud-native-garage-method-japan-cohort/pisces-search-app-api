require('dotenv').config()

const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path');

const app = express();
const cors = require('cors');
app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  "preflightContinue": false,
  "optionsSuccessStatus": 200
}));

const indexRouter = require('./routes/index');
const searchRouter = require('./routes/search');
const mockRouter = require('./routes/mock')


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

const resData = {
  data: [
      {
          "text": "コロナ・エキストラ[1]（スペイン語: Corona Extra）とは、モデーロ（Grupo Modelo）が製造するメキシコビールの銘柄。コロナ、コローナと corona の日本語転写は複数あるが、本記事では固有名称以外はアンハイザー・ブッシュ・インベブ・ジャパンが定める「コロナ」と記載する。",
          "score": 0.92,
          "concepts": [
              {
                  "name":"ビール",
                  "relevance": 0.88
              },
              {
                  "name": "Youtube",
                  "relevance": 0.74
              }
          ]
      },
      {
          "text": "日本における2019年コロナウイルス感染症の流行状況（にほんにおける2019ねんコロナウイルスかんせんしょうのりゅうこうじょうきょう）では、日本における新型コロナウイルス感染症（COVID-19）の流行状況について述べる。",
          "score": 0.86,
          "concepts": [
              {
                  "name":"風邪",
                  "relevance": 0.92
              },
              {
                  "name": "評判",
                  "relevance": 0.62
              }
          ]
      }
  ]
}

app.use('/', indexRouter);
// app.use('/search', searchRouter);
app.post('/search', (req, res) => {
  res.json(resData);
})
app.use('/mock', mockRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
