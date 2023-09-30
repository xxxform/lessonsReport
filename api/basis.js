import db from '../db.js';

export const pad = number => number.toString().padStart(2, '0');

export const splitArray = (array, countOfElement) => {
    const result = [];
    let iterations = Math.ceil(array.length / countOfElement);
    for (let i = 0; i < iterations; i++) {
        const from = i * countOfElement;
        result.push(array.slice(from, from + countOfElement));
    }
    return result;
}

export const populate = async (toPopulate, tableName, fields, cache) => {
    const idsToQuery = [];

    for (let i = 0; i < toPopulate.length; i++) {
        const id = toPopulate[i];
        const cached = cache[id];
        if (cached) toPopulate[i] = cached;
        else idsToQuery.push(id);
    }
    
    if (idsToQuery.length > 0) {
        const query = `SELECT ${fields} FROM ${tableName} WHERE id IN (${idsToQuery})`;
        const result = (await db.query(query)).rows;
        for (let i = 0; i < toPopulate.length; i++) {
            const id = toPopulate[i];
            if (typeof id !== 'number') continue;
            toPopulate[i] = cache[id] = result.find(item => item.id === id);
        }
    }

    return toPopulate;
}

export class UserError extends Error {}

export const handleError = async (ctx, error) => {
    ctx.status = error instanceof UserError ? 400 : 500;
    ctx.body = error.message;
}