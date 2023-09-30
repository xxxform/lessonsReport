import {UserError} from './basis.js';

const validator = ({ days, firstDate, lessonsCount, lastDate }) => {
    if (days.some(day => day > 6 || day < 0)) 
        throw UserError('Неверный параметр days');

    if (isNaN(+firstDate)) 
        throw UserError('Неверный параметр firstDate');

    if (!(!!(lessonsCount) ^ !!(+lastDate))) 
        throw UserError('Ожидается только один из параметров lessonsCount или lastDate');
    
    if (lessonsCount > 300) 
        throw UserError('Количество занятий не может быть больше 300');
    
    if (!+lastDate && isFinite(lessonsCount) && lessonsCount < 1) 
        throw UserError('Неверный параметр lessonsCount');

    if (!!+lastDate) {
        if (lastDate < firstDate) 
            throw UserError('lastDate не может быть больше firstDate');
        
        if (lastDate - firstDate > 31536000000) 
            throw UserError('период не может быть больше года');
    }
}

export default validator;