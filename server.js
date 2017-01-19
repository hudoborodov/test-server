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
		res.sendFile('C:\\project\\server\\FSDEPH.log', options, function (err) {
			if (err) {
				logger.info(err);
				res.status(err.status).end();
			} else {
				logger.info('Sent:', 'C:\\project\\server\\log.log');
			}
		});
	});

	app.listen(3000, function () {
		logger.info('Example app listening on port 3000!');
	});
}
