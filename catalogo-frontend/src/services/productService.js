import api from './api';

const productService = {
  // Get all products in the catalog
  getAllProducts: async () => {
    try {
      const response = await api.get('/prodottiCatalogo/prodotti');
      // Non modificare i percorsi delle immagini, sono già URL completi
      return response;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
  

  getProductById: async (productId) => {
    try {
      const response = await api.get(`/prodottiCatalogo/prodotti/${productId}`);
      // Assicurati che response.data sia un oggetto valido
      console.log("Prodotto ricevuto:", response);
      return response; // Potrebbe essere necessario usare response invece di response.data
    } catch (error) {
      console.error(`Error fetching product with ID ${productId}:`, error);
      throw error;
    }
  },

  // Get products by category from the catalog endpoints
  getProductsByCategory: async (category) => {
    try {
      // Non modificare i percorsi delle immagini
      return await api.get(`/prodottiCatalogo/categoria/${category}`);
    } catch (error) {
      console.error(`Error fetching products for category ${category}:`, error);
      throw error;
    }
  },


  // Get products by subcategory from the catalog endpoints
  getProductsBySubcategory: async (category, subcategory) => {
    try {
      // Non modificare i percorsi delle immagini
      return await api.get(`/prodottiCatalogo/categoria/${category}/sottocategoria/${subcategory}`);
    } catch (error) {
      console.error(`Error fetching products for subcategory ${subcategory}:`, error);
      throw error;
    }
  },
  
   // Create a new product
   createProduct: async (productData) => {
    try {
      // Using FormData to handle file uploads
      const formData = new FormData();
      
      // Add basic product data
      for (const key in productData) {
        if (key !== 'immagini') {
          formData.append(key, productData[key]);
        }
      }
      
      // Add images if present
      if (productData.immagini && Array.isArray(productData.immagini)) {
        productData.immagini.forEach((image, index) => {
          formData.append('immagini', image);
        });
      }
      
      const response = await api.post('/prodottiCatalogo/prodotti', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Non modificare i percorsi delle immagini nella risposta
      return response;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },
  
  // Update a product
  updateProduct: async (productId, productData) => {
    try {
      // Using FormData to handle file uploads
      const formData = new FormData();
      
      // Add basic product data
      for (const key in productData) {
        if (key !== 'immagini' && key !== 'immaginiToRemove') {
          formData.append(key, productData[key]);
        }
      }
      
      // Add images to remove
      if (productData.immaginiToRemove && Array.isArray(productData.immaginiToRemove)) {
        productData.immaginiToRemove.forEach(imageUrl => {
          formData.append('immaginiToRemove', imageUrl);
        });
      }
      
      // Add new images
      if (productData.immagini && Array.isArray(productData.immagini)) {
        productData.immagini.forEach(image => {
          if (image instanceof File) {
            formData.append('immagini', image);
          }
        });
      }
      
      const response = await api.put(`/prodottiCatalogo/prodotti/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Non modificare i percorsi delle immagini nella risposta
      return response;
    } catch (error) {
      console.error(`Error updating product with ID ${productId}:`, error);
      throw error;
    }
  },
  
  // Delete a product
  deleteProduct: async (productId) => {
    try {
      return await api.delete(`/prodottiCatalogo/prodotti/${productId}`);
    } catch (error) {
      console.error(`Error deleting product with ID ${productId}:`, error);
      throw error;
    }
  }
};

export default productService;