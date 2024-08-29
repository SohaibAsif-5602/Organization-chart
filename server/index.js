import mysql from 'mysql2'
import cors from 'cors'
import express, { query } from 'express'


const app = express();

app.use(cors());

const sql =mysql.createConnection({
    user:"root",
    host:'localhost',
    password:'Sohaib210886sql',
    database:'Orgdata'
})

app.get('/',(req,res)=>{
    const query1="Select * from members"
    sql.query(query1,(err,result)=>{
        if(err) return res,josn({msg:"Error from server"});
        else
        return res.json(result)
    })
})

app.listen(8080,()=>{
    console.log("Server running on 8080");
})