import api from './api';

const productService = {
  // Get all products in the catalog
  getAllProducts: async () => {
    try {
      return await api.get('/prodottiCatalogo/prodotti');
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get a single product by ID
  getProductById: async (productId) => {
    try {
      return await api.get(`/prodottiCatalogo/prodotti/${productId}`);
    } catch (error) {
      console.error(`Error fetching product with ID ${productId}:`, error);
      throw error;
    }
  },

  // Get products by category
  getProductsByCategory: async (categoryId) => {
    try {
      return await api.get(`/gestoreProdotti/prodotti/categoria/${categoryId}`);
    } catch (error) {
      console.error(`Error fetching products for category ${categoryId}:`, error);
      throw error;
    }
  },

  // Get products by subcategory
  getProductsBySubcategory: async (categoryId, subcategoryId) => {
    try {
      return await api.get(`/gestoreProdotti/prodotti/categoria/${categoryId}/sottocategoria/${subcategoryId}`);
    } catch (error) {
      console.error(`Error fetching products for subcategory ${subcategoryId}:`, error);
      throw error;
    }
  }
};

export default productService;
