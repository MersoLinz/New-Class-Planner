import express from "express";
import multer from "multer";
import { db } from "../db.js";
import { uploadImage, deleteImage } from "../cloudinary.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { text, subject_id, page_id, user_id } = req.body;

    // Slugs holen --> ganz wichtig, damit die Bilder im richtigen Ordner landen
    // Slugs sind die Namen der Fächer/Seiten in der Cloudinary Struktur
    const [[subject]] = await db
      .promise()
      .query("SELECT slug FROM subjects WHERE id = ?", [subject_id]);

    const [[page]] = await db
      .promise()
      .query("SELECT slug FROM pages WHERE id = ?", [page_id]);

    let imageUrl = null;
    let publicId = null;

    if (req.file) {
      const uploaded = await uploadImage(
        req.file.path,
        subject.slug,
        page.slug
      );
      imageUrl = uploaded.url;
      publicId = uploaded.public_id;
    }

    await db.promise().query(
      `INSERT INTO entries 
       (subject_id, page_id, text, image_url, cloudinary_public_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [subject_id, page_id, text, imageUrl, publicId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

router.get("/", async (req, res) => {
  const { subject_id, page_id } = req.query;

  try {
    const [rows] = await db.promise().query(
     `SELECT *
       FROM entries
       WHERE subject_id = ? AND page_id = ?
       ORDER BY created_at DESC`,
      [subject_id, page_id]
    );


    res.json(rows);
  } catch (err) {
    res.status(500).json([]);
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const [[entry]] = await db
      .promise()
      .query("SELECT cloudinary_public_id FROM entries WHERE id = ?", [id]);

    if (entry?.cloudinary_public_id) {
      await deleteImage(entry.cloudinary_public_id);
    }

    await db.promise().query("DELETE FROM entries WHERE id = ?", [id]);

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

export default router;
