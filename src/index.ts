import { Client  } from "pg";

// Creating an instance of an postgres client
// The Client constructor either accepts a client object or an string 
const pgClient = new Client("postgresql://neondb_owner:npg_0xEhOM8VAfzm@ep-autumn-frog-a5knrug8-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require")

async function main() {
    await pgClient.connect();
    const response = await pgClient.query("SELECT * FROM users;")
    console.log(response.rows);
}

main()
