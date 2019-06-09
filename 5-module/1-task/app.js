const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(__dirname + '/public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let message = null;

let clients = [];

router.get('/subscribe', async (ctx, next) => {
    await new Promise((resolve, reject) => {
        clients.push(message => {
            ctx.body = message;
            resolve(message)
        });
    });
});

router.post('/publish', async (ctx, next) => {
    if (ctx.request.body.message) {
        clients.forEach(resolve => {
            resolve(ctx.request.body.message);
        });
    }

    ctx.body = message;
});

app.use(router.routes());

module.exports = app;
