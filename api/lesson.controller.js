import {handleError} from './basis.js';
import LessonService from './lesson.service.js';
import LessonTeachersService from './lessonTeachers.service.js';

class LessonController {
    async getLessons(ctx) {
        try {
            ctx.body = await LessonService.getLessons(ctx.request.query);
        } catch(error) {
            handleError(ctx, error);
        }
    }
    async createLessons(ctx) {
        try {
            const lessonIds = await LessonService.createLessons(ctx.request.body);
            await LessonTeachersService.linkTeachersToLessons(ctx.request.body.teacherIds, lessonIds);
            ctx.body = lessonIds;
        } catch(error) {
            handleError(ctx, error);
        }
    }
}

export default new LessonController();