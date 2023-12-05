const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 5000;

// Enable CORS
app.use(cors());

// Set up multer storage
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // Process the uploaded file as needed (e.g., save the file path to a database)

  res.status(200).send('File uploaded successfully.');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
