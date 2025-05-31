import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = 4000;

// Absolute path to uploads folder
const uploadDir = path.resolve(__dirname, '../uploads');

// Ensure folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ uploads/ folder created at:', uploadDir);
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir)); // Serve uploaded files

// Multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.floor(Math.random() * 1e9)}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// Upload route
app.post('/upload', upload.single('avatar'), (req, res): void => {
  console.log('📥 Upload request received');

  if (!req.file) {
    console.log('❌ No file uploaded');
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  console.log('✅ Uploaded:', req.file.filename);

  const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ imageUrl });
});

// Root test route
app.get('/', (_req, res) => {
  res.send('StudyBuddy Server is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
