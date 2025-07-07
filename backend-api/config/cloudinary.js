const cloudinary = require('cloudinary').v2;

// Configurazione di Cloudinary
cloudinary.config({
  cloud_name: 'djdy2thaa',
  api_key: '947326926181229',
  api_secret: 'O1DLYxsphMgi_2Irv48Umhpvwt0',
  secure: true
});

module.exports = cloudinary;