import mysql from "mysql2";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "classplanner",
});

db.connect((err) => {
  if (err) {
    console.error("DB Fehler:", err);
  } else {
    console.log("MySQL verbunden");
  }
});
