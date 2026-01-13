import express from "express";
import cors from "cors";
import { db } from "./db.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql =
    "SELECT * FROM login WHERE username = ? AND password = ?";

  db.query(sql, [username, password], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false });
    }

    if (result.length > 0) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false });
    }
  });
});

app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});
