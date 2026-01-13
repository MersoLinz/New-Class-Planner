import mysql from "mysql2";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "classplanner"
});

db.connect((err) => {
  if (err) {
    console.log("DB Fehler:", err);
  } else {
    console.log("Mit Datenbank verbunden");
  }
});
