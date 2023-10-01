import db from '../db.js';
import {pad, populate, UserError} from './basis.js';

export default {
    async getLessons(parameters, filters) {
        let mainQuery = `SELECT * FROM lessons`;
        
        if (filters.length > 0) 
            mainQuery += ' WHERE '+ filters.join(' AND ');

        const lessonsPerPage = parseInt(parameters.lessonsPerPage) || 5;
        mainQuery += ` LIMIT ${lessonsPerPage}`;

        if (parameters.page) {
            parameters.page = +parameters.page;
            if (isNaN(parameters.page) || parameters.page < 1) 
                throw new UserError('Неверный параметр page');

            mainQuery += ` OFFSET ${(lessonsPerPage * (parameters.page - 1))};`;
        }
        
        const result = await db.query(mainQuery);

        //Кэшируем полученные записи. При высокой нагрузке кэш можно перенести в Redis
        const teachers = {};
        const students = {};

        for (const lesson of result.rows) {
            lesson.date = `${lesson.date.getFullYear()}-${pad(lesson.date.getMonth() + 1)}-${pad(lesson.date.getDate())}`;
            
            const lessonTeachersResult = (await db.query(`SELECT teacher_id AS id FROM lesson_teachers WHERE lesson_id = ${lesson.id}`)).rows;
            lesson.teachers = await populate(lessonTeachersResult.map(({id}) => id) , 'teachers', '*', teachers);

            let visitCount = 0;
            const lessonStudentsResult = (await db.query(`SELECT visit, student_id AS id FROM lesson_students WHERE lesson_id = ${lesson.id}`)).rows;
            lesson.students = await populate(lessonStudentsResult.map(({id}) => id), 'students', '*', students);
            lesson.students.forEach(student => {
                const lessonStudent = lessonStudentsResult.find(({id}) => id === student.id);
                visitCount += student.visit = lessonStudent.visit;
            });
            lesson.visitCount = visitCount;
        }
        
        return result.rows;
    }, 

    async createLessons({title, days, firstDate, lessonsCount, lastDate}) {
        lastDate = new Date(lastDate);
        firstDate = new Date(firstDate);
        
        let lessonQueryValues = [];
        const sunday = new Date(firstDate);
        sunday.setDate(firstDate.getDate() - firstDate.getDay()); //Ищем ближайшее слева вс 
        
        //шаг внешнего цикла - неделя.  
        outer: while(true) {
            for (const dayOfWeek of days) {//Ходим по неделям и заполняем маску days
                if (lessonQueryValues.length >= 300) break outer; 
                if (!+lastDate && lessonsCount < 1) break outer;
                const date = new Date(sunday);
                date.setDate(sunday.getDate() + dayOfWeek);
                if (date < firstDate) continue;
                if (!!+lastDate && date > lastDate) break outer;
                if (date - firstDate > 31536000000) break outer; //больше года
                
                lessonQueryValues.push(`('${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}','${title}',0)`);
                lessonsCount--;
            }
            
            sunday.setDate(sunday.getDate() + 7);
        }
        
        const query = `INSERT INTO lessons (date, title, status) VALUES ${lessonQueryValues} RETURNING id`;
        const result = (await db.query(query)).rows.map(({id}) => id);
        
        return result;
    }
}