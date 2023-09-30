import Router from 'koa-router';
import lessonController from '../api/lesson.controller.js';
import { koaBody } from 'koa-body';

const router = new Router();

router.post('/lessons', koaBody(), lessonController.createLessons);
router.get('/', lessonController.getLessons);

export default router.routes();