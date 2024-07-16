import pg from 'pg'

export const pool = new pg.Pool({
    user: "postgres",
    host: "localhost",
    password: "1234",
    database: "ProyectoWeb2",
    port: "5432"
}); 

pool.query('select now()').then(result => {
    console.log(result)
});