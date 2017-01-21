/*
 * Valera Hudoborodov
 */
 'use strict';

 const express = require('express');
 const docs = require('express-mongoose-docs');
 const bunyan = require('bunyan');
 const logger = bunyan.createLogger({
     name : 'server'
 });
 const app = express();
 const myShows = ['Bones', 'Psych', 'Big Bang Theory', 'success', 'Breaking Bad', 'Modern Family', 'Game of Thrones', 'Dexter'];
 function getTimeout() {
     return Math.random() * 10000;
 }
 function sleep (time) {
     return new Promise(resolve => setTimeout(resolve, time));
 }
 function doSomething(retry) {     
     const randomTimeout = getTimeout();
     const result = myShows[Math.floor(Math.random() * myShows.length)];
     logger.info('###\nstart doing something',retry,'timeout:', randomTimeout,'\n###');
     return sleep(randomTimeout).then(()=>result);
 }

 start();

 function start() {
     
     logger.info(getTimeout());
     
     app.get('/', (req, res) => {
         res.send('Hello World!');
     });

     app.get('/log', (req, res) => {
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

     app.get('/polling', function(req, res) {
         let retry = 0;
         const started = Date.now();
         let pollingTimer = setTimeout(function polling() {
             retry++;
             logger.info('test');
             doSomething(retry)
                    .then(result => {
                        logger.info('###\ndone something\n', 'retry: ', retry, 'result', result);
                        const gap = Date.now() - started;
                        logger.info('gap:', gap);
                        if (result == 'success' || gap > 20000) {
                            clearTimeout(pollingTimer);
                            res.send(result);
                        } else {
                            pollingTimer = setTimeout(polling, 2000);
                        }                         
                    });
         }, 2000);
     });
     
     docs(app);
     
     app.listen(3000, function () {
         logger.info('Example app listening on port 3000!');
     });
 }