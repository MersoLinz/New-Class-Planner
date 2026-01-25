import express from "express";
import cors from "cors";
import entriesRoutes from "./routes/entries.js";
import { db } from "./db.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use("/entries", entriesRoutes);

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT id FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, result) => {
      if (err) return res.status(500).json({ success: false });

      if (result.length > 0) {
        res.json({ success: true, user_id: result[0].id });
      } else {
        res.status(401).json({ success: false });
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
