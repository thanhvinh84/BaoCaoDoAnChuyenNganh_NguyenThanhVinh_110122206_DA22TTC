const mysql = require('mysql2');

const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "thanhvinhtv1523",
    database: process.env.DB_NAME || "webdodientu"
});

module.exports = db;


// kết nối database ở đây
