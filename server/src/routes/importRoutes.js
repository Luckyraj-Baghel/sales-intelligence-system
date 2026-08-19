const express = require('express');
const multer = require('multer');
const path = require('path');
const importController = require('../controllers/importController');

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `sales-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File filter (Only CSV allowed)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
    cb(null, true);
  } else {
    cb(new Error('Only .csv files are supported!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Route: POST /api/import/sales (Direct, without /v1)
router.post('/sales', upload.single('file'), importController.uploadSalesCSV);

module.exports = router;