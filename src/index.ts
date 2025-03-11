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
    const city = req.body.city;
    const country = req.body.country;
    const street = req.body.street;
    const pincode = req.body.pincode;

    try{
          // SQL Injection
        const insertQuery = `INSERT INTO users (username , email , password) VALUES ($1 , $2 , $3) RETURNING id ; `
        const addressInsertQuery = `INSERT INTO addresses (city , country , street, pincode , user_id ) VALUES ($1 , $2 , $3 , $4 , $5); `
        // Transactions in SQL : When a set of queries are to be made one after the another , it is advised to wrap them in a transaction , 
        // so that even if one of the queries fail , the changes made by the rest of the queries are reverted and the USER IS NOT PARTIALLY REGISTERED

    await pgClient.query("BEGIN;")

    const response = await pgClient.query(insertQuery , [username , email , password] );
    const userId = response.rows[0].id;
    const adresponse = await pgClient.query(addressInsertQuery , [city , country , street , pincode , userId])

    await pgClient.query("COMMIT;")


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

// Learning Joins in SQL
app.get("/metadata", async (req,res) => {
const id = req.query.id;

const query1 = `SELECT * FROM users WHERE id = $1 ;`
const response1 = await pgClient.query(query1 , [id]);

const query2 = `SELECT * FROM addresses WHERE user_id = $1 ;`
const response2 = await pgClient.query(query2 , [id]);

res.json({
    user : response1.rows[0],
    address : response2.rows
})

})

app.listen(3000);