const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const LimitSizeStream = require('../../2-module/1-task/LimitSizeStream');
const LimitExceededError = require('../../2-module/1-task/LimitExceededError');

const server = new http.Server();

server.on('request', (req, res) => {
    const pathname = url.parse(req.url).pathname.slice(1);

    const filepath = path.join(__dirname, 'files', pathname);

    switch (req.method) {
        case 'POST':
            req
                .on('aborted', () => fs.unlink(filepath, (err) => {}))
                .pipe(new LimitSizeStream({limit: 10240}))
                .on('error', error => handleError(413, res, filepath))
                .pipe(fs.createWriteStream(filepath, {flags: 'wx+'}))
                .on('error', error => error.code === 'EEXIST' ? handleError(409, res) : handleError(500, res))
                .on('close', () => handleError(201, res))
            ;
            break;

        default:
            res.statusCode = 501;
            res.end('Not implemented');
    }

    function handleError(code, res, filepath = null) {
        switch (code) {
            case 201:
                res.statusCode = 201;
                res.end();
                break;
            case 409:
                res.statusCode = 409;
                res.end('File is already exist');
                break;
            case 413:
                res.statusCode = 413;
                res.end();
                break;
            case 500:
                res.statusCode = 500;
                res.end('internal server error');
                break;
        }
        if (filepath) {
            fs.unlink(filepath, () => {
            });
        }
    }
});

module.exports = server;
