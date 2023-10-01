import {UserError} from './basis.js';

const validator = ({ days, firstDate, lessonsCount, lastDate }) => {
    lastDate = new Date(lastDate);
    firstDate = new Date(firstDate);

    if (days.some(day => day > 6 || day < 0)) 
        throw new UserError('Неверный параметр days');

    if (isNaN(+firstDate)) 
        throw new UserError('Неверный параметр firstDate');

    if (!(!!(lessonsCount) ^ !!(+lastDate))) 
        throw new UserError('Ожидается только один из параметров lessonsCount или lastDate');
    
    if (lessonsCount > 300) 
        throw new UserError('Количество занятий не может быть больше 300');
    
    if (!+lastDate && isFinite(lessonsCount) && lessonsCount < 1) 
        throw new UserError('Неверный параметр lessonsCount');

    if (!!+lastDate) {
        if (lastDate < firstDate) 
            throw new UserError('lastDate не может быть больше firstDate');
        
        if (lastDate - firstDate > 31536000000) 
            throw new UserError('период не может быть больше года');
    }
}

export default validator;