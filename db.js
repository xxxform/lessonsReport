import pg from 'pg';

const Pool = pg.Pool;

const pool = new pg.Pool({
    user: 'postgres',
    password: 'adminium',
    host: 'localhost',
    port: 5432,
    database: 'lessons'
});

export default pool;