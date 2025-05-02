const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

/**
 * Carica un file su Cloudinary
 * @param {Buffer} fileBuffer - Buffer del file da caricare
 * @param {string} folder - Cartella di destinazione su Cloudinary
 * @param {string} resource_type - Tipo di risorsa ('image' o 'raw' per i PDF)
 * @returns {Promise} Promise con il risultato dell'upload
 */
const uploadToCloudinary = (fileBuffer, folder, resource_type = 'image') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        folder: folder,
        resource_type: resource_type
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

module.exports = { uploadToCloudinary };