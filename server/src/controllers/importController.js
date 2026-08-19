const ImportService = require('../services/importService');

exports.uploadSalesCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'Please attach a valid .csv file' });
    }

    const result = await ImportService.processSalesCSV(req.file.path);

    return res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    console.error('Import Controller Error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to process CSV import',
      details: error.message
    });
  }
};