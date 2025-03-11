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

app.get("/better-metadata" , async(req , res) => {
    const id = req.query.id;
    const query = `SELECT users.id , users.username , users.email , addresses.city, addresses.country , addresses.street , addresses.pincode
     FROM users JOIN addresses ON users.id = addresses.user_id WHERE users.id = $1 ;`

    const response = await pgClient.query(query , [id]);
    res.json({
        response : response.rows
    })
})

app.get("/better-metadata-2" , async(req,res) => {
    const id = req.query.id;
    const query = `SELECT u.id , u.username , u.email , a.city , a.country , a.street , a.pincode  FROM users u JOIN addresses a ON u.id = a.user_id WHERE u.id = $1 ;`
    const response = await pgClient.query(query , [id]);
    res.json({
        response : response.rows
    })
})
// There are multiple types of joins - left join , right join , inner-join , full-join
// Inner-join - Returns rows when there is atleast one match in both tables. if there is no match , no rows are returned
// Left-join : Returns all rows from the left-side , and the matched rows from the right side . If something doesn't exist on the right side , 
// the corresponding columns will be left empty 
// Right-Join : Self-explanatory
// Full-Join : returns all the rows , both from the left-side and the right side , any missing entry , either from the 
// left side or the right side , will be null in the final join result

app.listen(3000);