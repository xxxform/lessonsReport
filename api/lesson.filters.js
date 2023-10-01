import {UserError} from './basis.js';

const filters = {
    teacherIds(teacherIds) {
        teacherIds = teacherIds.split(',');

        if(teacherIds.some(id => isNaN(+id))) 
            throw new UserError('Неверный параметр teacherIds');

        return `lessons.id IN (SELECT lesson_id FROM lesson_teachers WHERE teacher_id IN(${teacherIds}))`;
    },

    studentsCount(studentsCount) {
        studentsCount = studentsCount.split(',');
        let from, to;
        if (studentsCount.length > 1) {
            [from, to] = studentsCount.map(n => parseInt(n));
            if (to < from) [from, to] = [to, from];
        } else {
            from = to = parseInt(studentsCount[0]);
        }

        if ([from, to].some(value => isNaN(value) || value < 0)) {
            throw new UserError('Неверный параметр studentsCount');
        }   

        return `lessons.id IN (SELECT lesson_id FROM lesson_students GROUP BY lesson_id HAVING COUNT(1) BETWEEN ${from} AND ${to})`;
    },

    status(status) {
        if (status.length !== 1) throw new UserError('Неверный параметр status');
        if (!['0', '1'].some(valid => valid === status)) throw new UserError('Неверный параметр status');;
        
        return `lessons.status = ${status}`;
    },

    date(date) {
        let from, to;
        if (date.includes(',')) {
            [from, to] = date.split(','); 
        } else {
            from = to = date;
        }

        const dateFrom = new Date(from), dateTo = new Date(to);
        if (isNaN(+dateFrom) || isNaN(+dateTo)) 
            throw new UserError('Неверный параметр date');
        
        if (dateFrom > dateTo) [from, to] = [to, from]; //создание экземпляра дат и сравнение

        return `lessons.date BETWEEN '${from}' AND '${to}'`;
    }
}

export default (parameters, filterOrder) => {
    const filterResults = [];
    for (const filterName of filterOrder) {
        const parameter = parameters[filterName];
        const filter = filters[filterName];
        if (!parameter || !filter) continue;
        filterResults.push(filter(parameters[filterName]));
    }
    return filterResults;
};