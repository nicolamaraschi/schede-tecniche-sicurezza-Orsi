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
  },
  
  // Get all subcategories in the catalog
  getAllSubcategories: async () => {
    try {
      return await api.get('/prodottiCatalogo/sottocategorie');
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      throw error;
    }
  },
  
  // Get subcategories for a specific category
  getSubcategoriesByCategory: async (category) => {
    try {
      return await api.get(`/prodottiCatalogo/categoria/${category}/sottocategorie`);
    } catch (error) {
      console.error(`Error fetching subcategories for category ${category}:`, error);
      throw error;
    }
  },
  
  // Add a new subcategory to a category
  addSubcategory: async (category, subcategoryName) => {
    try {
      return await api.post(`/prodottiCatalogo/categoria/${category}/sottocategorie`, {
        sottocategoria: subcategoryName
      });
    } catch (error) {
      console.error(`Error adding subcategory to category ${category}:`, error);
      throw error;
    }
  },
  
  // Update a subcategory name
  updateSubcategory: async (category, subcategory, newName) => {
    try {
      return await api.put(`/prodottiCatalogo/categoria/${category}/sottocategoria/${subcategory}`, {
        nuovoNome: newName
      });
    } catch (error) {
      console.error(`Error updating subcategory ${subcategory}:`, error);
      throw error;
    }
  },
  
  // Delete a subcategory
  deleteSubcategory: async (category, subcategory) => {
    try {
      return await api.delete(`/prodottiCatalogo/categoria/${category}/sottocategoria/${subcategory}`);
    } catch (error) {
      console.error(`Error deleting subcategory ${subcategory}:`, error);
      throw error;
    }
  }
};

export default categoryService;