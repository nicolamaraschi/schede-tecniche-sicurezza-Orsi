import api from './api';

const productService = {
  // Get all products in the catalog
  getAllProducts: async (lang = 'it') => {
    try {
      const response = await api.get(`/prodottiCatalogo/prodotti?lang=${lang}`);
      return response;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
  

  getProductById: async (productId, lang = 'it') => {
    try {
      const response = await api.get(`/prodottiCatalogo/prodotti/${productId}?lang=${lang}`);
      console.log("Prodotto ricevuto:", response);
      return response;
    } catch (error) {
      console.error(`Error fetching product with ID ${productId}:`, error);
      throw error;
    }
  },

  // Get products by category from the catalog endpoints
  getProductsByCategory: async (category, lang = 'it') => {
    try {
      return await api.get(`/prodottiCatalogo/categoria/${category}?lang=${lang}`);
    } catch (error) {
      console.error(`Error fetching products for category ${category}:`, error);
      throw error;
    }
  },


  // Get products by subcategory from the catalog endpoints
  getProductsBySubcategory: async (category, subcategory, lang = 'it') => {
    try {
      return await api.get(`/prodottiCatalogo/categoria/${category}/sottocategoria/${subcategory}?lang=${lang}`);
    } catch (error) {
      console.error(`Error fetching products for subcategory ${subcategory}:`, error);
      throw error;
    }
  },
  
   // Create a new product
   createProduct: async (productData) => {
    try {
      const formData = new FormData();
      
      for (const key in productData) {
        if (key !== 'immagini') {
          formData.append(key, productData[key]);
        }
      }
      
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
      
      return response;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },
  
  // Update a product
  updateProduct: async (productId, productData) => {
    try {
      const formData = new FormData();
      
      for (const key in productData) {
        if (key !== 'immagini' && key !== 'immaginiToRemove') {
          formData.append(key, productData[key]);
        }
      }
      
      if (productData.immaginiToRemove && Array.isArray(productData.immaginiToRemove)) {
        productData.immaginiToRemove.forEach(imageUrl => {
          formData.append('immaginiToRemove', imageUrl);
        });
      }
      
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