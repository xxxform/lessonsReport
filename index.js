import Koa from 'koa';
import logger from 'koa-morgan';
import routes from './routes/index.js';

new Koa()
    .use(logger('tiny'))
    .use(routes)
    .listen(3000)