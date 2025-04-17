const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../config/db"); // Ensure MySQL connection is imported

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Folder where images will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// POST route to upload profile image
router.post("/upload-image", upload.single("profileImage"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }
  res.json({ path: `/uploads/${req.file.filename}` });
});

// Add a new resume with image support
router.post("/add", async (req, res) => {
  const { name, email, phone, education, experience, skills, profileImage } = req.body;

  try {
    const [result] = await db.execute(
      `INSERT INTO resumes (name, email, phone, education, experience, skills, profileImage) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, education, experience, skills, profileImage]
    );

    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error("Error saving resume:", error);
    res.status(500).json({ message: "Failed to save resume." });
  }
});

// GET all resumes
router.get("/all", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM resumes");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a resume by ID
router.get("/:id", async (req, res) => {
  const resumeId = req.params.id;

  try {
    const [rows] = await db.execute("SELECT * FROM resumes WHERE id = ?", [resumeId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;