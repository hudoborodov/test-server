/*
 * Valera Hudoborodov
 */

'use strict'

const express = require('express');
const docs = require("express-mongoose-docs");
const bunyan = require('bunyan');
const logger = bunyan.createLogger({
    name : "server"
  });
const app = express();
const methods = require('express/node_modules/methods');

start();

function start() {
  testdocs('test');

  app.get('/', function (req, res) {
    res.send('Hello World!');
  });

  app.get('/log', function (req, res) {
    const options = {
      dotfiles : 'deny',
      headers : {
        'x-timestamp' : Date.now(),
        'x-sent' : true
      }
    };
    const fileName = __dirname + '\\server.log';
    res.sendFile(fileName, options, function (err) {
      if (err) {
        logger.info(err);
        res.status(err.status).end();
      } else {
        logger.info('Sent:', fileName);
      }
    });
  });

  docs(app);

  app.listen(3000, function () {
    logger.info('Example app listening on port 3000!');
  });
}

function testdocs() {
  methods.forEach(method => {
      let orig = app[method];
      app[method] = (path, handler) => {
        logger.info("method:", method, "\npath:", path);
        //generate docs here
        //orig.apply(this, arguments);
      }
    });
}
