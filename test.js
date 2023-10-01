import db from './db.js';
import assert from 'assert/strict'; //переписать на chai 
import LessonService from './api/lesson.service.js';
import LessonTeachersService from './api/lessonTeachers.service.js';
import filters from './api/lesson.filters.js';

describe("createLessons", async function() {
    it('should create lessons 2 week by first-last dates', async function() {
        const query = {
            title: 'twoWeekTestLessonByDates', 
            days: [1,3,6],
            firstDate: '2023-10-01', 
            lastDate: '2023-10-15',
            lessonsCount: null 
        };
        const firstDate = new Date(query.firstDate);
        const lastDate = new Date(query.lastDate);
        
        const lessonIds = await LessonService.createLessons(query);
        const lessonsFromDb = await db.query(`SELECT * FROM lessons WHERE id IN (${lessonIds})`);
        
        for(const {date, title, status} of lessonsFromDb.rows) {
            assert.strictEqual(title, query.title, 'Неверное название созданного урока');
            assert.strictEqual(status, 0, 'Неверный статус созданного урока');
            assert.strictEqual(date >= firstDate && date <= lastDate, true, `Дата(${date}) не входит в создаваемый диапазон ${query.firstDate} - ${query.lastDate}`);
            assert.strictEqual(query.days.some(day => day === date.getDay()), true, `Неверный день недели. ${date.getDay()} не входит в ${query.days}`);
        }

        await db.query(`DELETE FROM lessons WHERE id IN (${lessonIds})`);
    });

    it('should create 10 lessons by firstDate', async function() {
        const query = {
            title: '10TestLessons', 
            days: [1,3,6],
            firstDate: '2023-10-01', 
            lastDate: null,
            lessonsCount: 10
        };
        const firstDate = new Date(query.firstDate);

        const lessonIds = await LessonService.createLessons(query);
        const lessonsFromDb = await db.query(`SELECT * FROM lessons WHERE id IN (${lessonIds})`);
        assert.strictEqual(lessonsFromDb.rows.length, query.lessonsCount, 'Неверное количество созданных уроков');
        
        for(const {date, title, status} of lessonsFromDb.rows) {
            assert.strictEqual(title, query.title, 'Неверное название созданного урока');
            assert.strictEqual(status, 0, 'Неверный статус созданного урока');
            assert.strictEqual(date > firstDate, true, `Дата(${date}) не входит в создаваемый диапазон ${query.firstDate} - ${Infinity}`);
            assert.strictEqual(query.days.some(day => day === date.getDay()), true, `Неверный день недели. ${date.getDay()} не входит в ${query.days}`);
        }

        await db.query(`DELETE FROM lessons WHERE id IN (${lessonIds})`);
    });

    it('should create 1 year lessons with limit 300', async function() {
        const query = {
            title: '1year300lessons', 
            days: [0,1,2,3,4,5,6],
            firstDate: '2021-10-02',
            lastDate: '2022-10-02'
        };

        const lessonIds = await LessonService.createLessons(query);
        assert.strictEqual(lessonIds.length, 300, 'Неверное количество созданных уроков');
        await db.query(`DELETE FROM lessons WHERE id IN (${lessonIds})`);
    });

    it('should create 300 lessons with limit 1year', async function() {
        const query = {
            title: '300lessons1year', 
            days: [1],
            firstDate: '2023-10-01',
            lessonsCount: 300
        };

        const lessonIds = await LessonService.createLessons(query);
        assert.strictEqual(lessonIds.length < 60 && lessonIds.length > 40, true, 'Неверное количество созданных уроков');
        
        const lessonsFromDb = (await db.query(`SELECT * FROM lessons WHERE id IN (${lessonIds})`));
        for(const {date} of lessonsFromDb.rows) {
            assert.strictEqual(date.getDay(), 1, `Неверный день недели`);
        }

        await db.query(`DELETE FROM lessons WHERE id IN (${lessonIds})`);
    });
});

describe("lessonTeachers", async function() {
    let lessonIds = [], teacherIds = [];

    it('should create lesson', async function() {
        const query = {
            title: '2TestLessons', 
            days: [0,1,2,3,4,5,6],
            firstDate: '2023-10-01', 
            lastDate: null,
            lessonsCount: 2
        };
        lessonIds = await LessonService.createLessons(query);
    });

    it('should create teacher', async function() {
        teacherIds = (await db.query(`INSERT INTO teachers (name) VALUES ('TEACHER1'), ('TEACHER2') RETURNING id`)).rows.map(({id}) => id);
    })

    it('should create lessonTeachers', async function() {
        await LessonTeachersService.linkTeachersToLessons(teacherIds, lessonIds);
        const lessonTeachersFromDb = await db.query(`SELECT * FROM lesson_teachers WHERE lesson_id IN (${lessonIds}) AND teacher_id IN (${teacherIds})`);

        assert.strictEqual(lessonTeachersFromDb.rows.length, 4, 'Неверное количество созданных сущностей');

        for (const {lesson_id, teacher_id} of lessonTeachersFromDb.rows) {
            assert.strictEqual(lessonIds.includes(lesson_id), true, `Создан неверный lesson_id ${lesson_id}`);
            assert.strictEqual(teacherIds.includes(teacher_id), true, `Создан неверный teacher_Id ${teacher_id}`);
        }
    });

    it('should delete created data', async function() {
        await db.query(`DELETE FROM lesson_teachers WHERE lesson_id IN (${lessonIds}) AND teacher_id IN (${teacherIds})`);
        await db.query(`DELETE FROM lessons WHERE id IN (${lessonIds})`);
        await db.query(`DELETE FROM teachers WHERE id IN (${teacherIds})`);
    })
});

describe("getLessons", async function() {
    /* 
        Здесь должны заново создаваться тестовые данные,
        изолированные от реальных(как в тесте выше) а после тестов удаляться.
        Я взял предоставленные из test.sql для ускорения разработки.
        В реальном проекте так делать нельзя, данные могут меняться и удаляться.
    */
    it('should get lessons by date range', async function() {
        const query = {
            date: '2019-09-01,2019-09-03'
        };
        const firstDate = new Date('2019-09-01');
        const lastDate = new Date('2019-09-03');

        const filterQueries = filters(query, ['teacherIds', 'studentsCount', 'status', 'date']);
        const result = await LessonService.getLessons(query, filterQueries);

        assert.strictEqual(result.length, 3, 'Неверное количество полученных сущностей');

        for (let {date} of result) {
            date = new Date(date);
            assert.strictEqual(date >= firstDate && date <= lastDate, true, `Дата(${date}) не входит в запрашиваемый диапазон ${query.date}`);
        }
    });

    it('should get lessons by status', async function() {
        const query = {
            status: '1'
        };

        const filterQueries = filters(query, ['teacherIds', 'studentsCount', 'status', 'date']);
        const result = await LessonService.getLessons(query, filterQueries);

        assert.strictEqual(result.length, 5, 'Неверное количество полученных сущностей');

        for (let {status} of result) {
            assert.strictEqual(status, 1, `Статус не соответствует запрашиваемому`);
        }
    });

    it('should get lessons by teacherIds', async function() {
        const teacherIds = [4];
        const query = {
            teacherIds: teacherIds.toString()
        };

        const filterQueries = filters(query, ['teacherIds', 'studentsCount', 'status', 'date']);
        const result = await LessonService.getLessons(query, filterQueries);

        assert.strictEqual(result.length, 3, 'Неверное количество полученных сущностей');

        for (let {teachers} of result) {
            assert.strictEqual(teachers.some(({id}) => teacherIds.includes(id)), true, 'Неверное количество полученных сущностей');
        }
    });

    it('should get lessons by studentsCount', async function() {
        const studentsCount = [3,4];
        const query = {
            studentsCount: studentsCount.toString()
        };

        const filterQueries = filters(query, ['teacherIds', 'studentsCount', 'status', 'date']);
        const result = await LessonService.getLessons(query, filterQueries);

        assert.strictEqual(result.length, 3, 'Неверное количество полученных сущностей');

        for (let {students} of result) {
            assert.strictEqual(students.length >= studentsCount[0] && students.length <= studentsCount[1] , true, 'Неверное количество полученных сущностей');
        }
    })

    it('pagination', async function() {
        const idOrder1 = [2, 5];
        const idOrder2 = [7, 10]

        const page1 = await LessonService.getLessons({
            page: 1, lessonsPerPage: 2
        }, []);

        assert.strictEqual(page1.length, 2, 'Неверное количество полученных сущностей');
        const ids1 = page1.map(({id}) => id);
        assert.strictEqual(ids1.every((id, index) => idOrder1[index] === id), true, `полученные id уроков (${ids1}) не соответствует ожидаемым (${idOrder1})`);

        const page2 = await LessonService.getLessons({
            page: 2, lessonsPerPage: 2
        }, []);
        assert.strictEqual(page2.length, 2, 'Неверное количество полученных сущностей');
        const ids2 = page2.map(({id}) => id);
        assert.strictEqual(ids2.every((id, index) => idOrder2[index] === id), true, `полученные id уроков (${ids2}) не соответствует ожидаемым (${idOrder2})`);
    })
});

const queryTemplate = {
    date: '',
    status: '',
    teacherIds: '',
    studentsCount: '',
    page: '',
    lessonsPerPage: ''
};


