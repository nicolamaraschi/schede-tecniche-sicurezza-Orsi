import api from './api';

const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    try {
      return await api.get('/gestoreProdotti/categorie');
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get a single category by ID
  getCategoryById: async (categoryId) => {
    try {
      return await api.get(`/gestoreProdotti/categorie/${categoryId}`);
    } catch (error) {
      console.error(`Error fetching category with ID ${categoryId}:`, error);
      throw error;
    }
  }
};

export default categoryService;
