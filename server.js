/*
 * Valera Hudoborodov
 */

'use strict'

const express = require('express');
const bunyan = require('bunyan');
const logger = bunyan.createLogger({
    name : "server"
  });
const app = express();

start();

function start() {
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

  app.listen(3000, function () {
    logger.info('Example app listening on port 3000!');
  });
}
