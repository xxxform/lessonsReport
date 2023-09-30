import db from '../db.js';
import {splitArray} from './basis.js';

export default {
    async linkTeachersToLessons(teacherIds, lessonIds) {
        const lessonTeachrsQueryValues = [];

        for (let teacherId of teacherIds) {
            for (let id of lessonIds) {
                lessonTeachrsQueryValues.push(`(${id},${teacherId})`);
            }
        }
        //ограничение sql на вставку записей этим способом - 1000 записей. Делим массив на чанки. 
        //Порционное обращения к таблице бд также поможет избежать длительной блокировки таблицы при вставке записей
        let splittedArray = splitArray(lessonTeachrsQueryValues, 1000);

        return Promise.all(splittedArray.map(() => 
            db.query( `INSERT INTO lesson_teachers (lesson_id, teacher_id) VALUES ${lessonTeachrsQueryValues}`)
        ));
    }
}