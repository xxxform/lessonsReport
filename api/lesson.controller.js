import {handleError} from './basis.js';
import LessonService from './lesson.service.js';
import LessonTeachersService from './lessonTeachers.service.js';
import filters from './lesson.filters.js';
import validator from './lesson.validator.js';

class LessonController {
    async getLessons(ctx) {
        try {
            const filterQueries = filters(ctx.request.query, ['date', 'status', 'teacherIds', 'studentsCount']);
            ctx.body = await LessonService.getLessons(ctx.request.query, filterQueries);
        } catch(error) {
            handleError(ctx, error);
        }
    }
    async createLessons(ctx) {
        try {
            validator(ctx.request.body);
            const lessonIds = await LessonService.createLessons(ctx.request.body);
            await LessonTeachersService.linkTeachersToLessons(ctx.request.body.teacherIds, lessonIds);
            ctx.body = lessonIds;
        } catch(error) {
            handleError(ctx, error);
        }
    }
}

export default new LessonController();