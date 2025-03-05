import { Client  } from "pg";
import express from "express";
const app = express();
app.use(express.json())
// Creating an instance of an postgres client
// The Client constructor either accepts a client object or an string 
const pgClient = new Client("postgresql://neondb_owner:npg_0xEhOM8VAfzm@ep-autumn-frog-a5knrug8-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require")

pgClient.connect()

app.post("/signup" , async(req , res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    try{
          // SQL Injection
        const insertQuery = `INSERT INTO users (username , email , password) VALUES ($1 , $2 , $3); `
    const response = await pgClient.query(insertQuery , [username , email , password] );
    res.json({
        message : "You have signed up"
    })
    }catch(e){
        console.log(e);
        res.json({
            message : "An error occured"
        })
    }

})

app.listen(3000);