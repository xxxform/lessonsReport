//http://localhost:3000/?teachersIds=1,4
/*
[{"id":2,"date":"2019-08-02","title":"Red Color","status":0,"teachers":[{"id":1,"name":"Sveta"},{"id":4,"name":"Masha"}],"students":[{"id":2,"name":"Sergey"},{"id":3,"name":"Maxim"}]},{"id":7,"date":"2019-05-17","title":"White Color","status":0,"teachers":[{"id":1,"name":"Sveta"}],"students":[{"id":2,"name":"Sergey"},{"id":1,"name":"Ivan"}]},{"id":1,"date":"2019-08-01","title":"Green Color","status":1,"teachers":[{"id":1,"name":"Sveta"},{"id":3,"name":"Angelina"}],"students":[{"id":1,"name":"Ivan"},{"id":2,"name":"Sergey"},{"id":3,"name":"Maxim"}]},{"id":4,"date":"2019-08-04","title":"Blue Color","status":1,"teachers":[{"id":4,"name":"Masha"}],"students":[{"id":1,"name":"Ivan"},{"id":2,"name":"Sergey"},{"id":3,"name":"Maxim"},{"id":4,"name":"Slava"}]},{"id":8,"date":"2019-05-17","title":"Black Color","status":1,"teachers":[{"id":4,"name":"Masha"},{"id":3,"name":"Angelina"},{"id":2,"name":"Marina"}],"students":[{"id":1,"name":"Ivan"},{"id":4,"name":"Slava"},{"id":2,"name":"Sergey"}]}]

http://localhost:3000/?studentsCount=1
[{"id":9,"date":"2019-05-20","title":"Yellow Color","status":1,"teachers":[{"id":3,"name":"Angelina"}],"students":[{"id":2,"name":"Sergey"}]}]

http://localhost:3000/?studentsCount=2,1&lessonsPerPage=100
[{"id":9,"date":"2019-06-20","title":"Yellow Color","status":1,"teachers":[{"id":3,"name":"Angelina"}],"students":[{"id":2,"name":"Sergey"}]},{"id":5,"date":"2019-05-10","title":"Purple Color","status":0,"teachers":[],"students":[{"id":4,"name":"Slava"},{"id":2,"name":"Sergey"}]},{"id":10,"date":"2019-06-24","title":"Brown Color","status":0,"teachers":[{"id":3,"name":"Angelina"}],"students":[{"id":1,"name":"Ivan"},{"id":3,"name":"Maxim"}]},{"id":6,"date":"2019-05-15","title":"Red Color","status":1,"teachers":[{"id":3,"name":"Angelina"}],"students":[{"id":1,"name":"Ivan"},{"id":3,"name":"Maxim"}]},{"id":2,"date":"2019-09-02","title":"Red Color","status":0,"teachers":[{"id":1,"name":"Sveta"},{"id":4,"name":"Masha"}],"students":[{"id":2,"name":"Sergey"},{"id":3,"name":"Maxim"}]},{"id":7,"date":"2019-06-17","title":"White Color","status":0,"teachers":[{"id":1,"name":"Sveta"}],"students":[{"id":2,"name":"Sergey"},{"id":1,"name":"Ivan"}]}]

http://localhost:3000/?lessonsPerPage=3&page=2&studentsCount=2,1
[{"id":6,"date":"2019-05-15","title":"Red Color","status":1,"teachers":[{"id":3,"name":"Angelina"}],"students":[{"id":1,"name":"Ivan"},{"id":3,"name":"Maxim"}]},{"id":2,"date":"2019-09-02","title":"Red Color","status":0,"teachers":[{"id":1,"name":"Sveta"},{"id":4,"name":"Masha"}],"students":[{"id":2,"name":"Sergey"},{"id":3,"name":"Maxim"}]},{"id":7,"date":"2019-06-17","title":"White Color","status":0,"teachers":[{"id":1,"name":"Sveta"}],"students":[{"id":2,"name":"Sergey"},{"id":1,"name":"Ivan"}]}]

{
    "teacherIds": [1,2],
    "title": "Blue Ocean",
    "days": [0,1,3,6],
    "firstDate": "2019-09-10",
    "lessonsCount": 9,
    "lastDate": "2019-12-31"
}
*/



