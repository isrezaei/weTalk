const { Client } = require("pg");

const db = new Client({
  user: "postgres",
  host: "db.jypkghsswdcnotmnrieb.supabase.co",
  database: "postgres",
  password: "retsoo13795539",
  port: 5432,
});

db
  .connect()
  .then(() => console.log("Connected to the database"))
  .catch((error) => console.error("Error connecting to the database:", error));

module.exports = {db}