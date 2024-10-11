import mysql from 'mysql2';

let sql;

export const connectDB = () => {
    sql = mysql.createConnection({
        user: 'root',
        host: 'localhost',
        password: 'Sohaib210886sql',
        database: 'Orgdata'
    });

    sql.connect((err) => {
        if (err) {
            console.error('Error connecting to the database:', err.message);
        } else {
            console.log('Successfully connected to the database');
        }
    });
};

export { sql };
