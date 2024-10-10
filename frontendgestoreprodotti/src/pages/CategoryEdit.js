import React, { useEffect, useState } from 'react';
import { fetchCategories, updateCategory } from '../api'; // Importa le funzioni API necessarie
import './CategoryEdit.css'; // Stili per il componente

const CategoryEdit = () => {
  const [categories, setCategories] = useState([]); // Stato per la lista delle categorie
  const [loading, setLoading] = useState(true); // Stato di caricamento
  const [showModal, setShowModal] = useState(false); // Stato per il popup
  const [selectedCategory, setSelectedCategory] = useState(null); // Categoria selezionata per la modifica

  useEffect(() => {
    const loadCategoriesList = async () => {
      try {
        const data = await fetchCategories(); // Funzione per ottenere la lista delle categorie
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false); // Imposta il caricamento a false quando i dati sono stati recuperati
      }
    };

    loadCategoriesList(); // Carica la lista delle categorie al caricamento del componente
  }, []);

  const handleEditClick = (category) => {
    setSelectedCategory(category); // Imposta la categoria selezionata
    setShowModal(true); // Mostra il popup
  };

  const handleCloseModal = () => {
    setShowModal(false); // Chiude il popup
    setSelectedCategory(null); // Resetta la categoria selezionata
  };

  const handleUpdateCategory = async (event) => {
    event.preventDefault(); // Previene il comportamento predefinito del modulo

    if (!selectedCategory) return;

    const updatedCategory = {
      ...selectedCategory,
      name: event.target.name.value,
      subcategories: selectedCategory.subcategories.map((sub, index) => ({
        name: event.target[`subcategory-${index}`].value, // Ottieni il nome della sottocategoria
        _id: sub._id // Mantieni l'ID della sottocategoria esistente
      })),
    };

    try {
      await updateCategory(selectedCategory._id, updatedCategory); // Aggiorna la categoria
      handleCloseModal(); // Chiudi il popup
      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat._id === updatedCategory._id ? updatedCategory : cat
        )
      ); // Aggiorna la lista delle categorie
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Mostra un messaggio di caricamento
  }

  return (
    <div className="container mt-4">
      <h2>Elenco delle Categorie</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Categoria</th>
            <th>Sottocategorie</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category._id}>
              <td>{category.name}</td>
              <td>{category.subcategories.map(sub => sub.name).join(', ')}</td> {/* Mostra le sottocategorie */}
              <td>
                <button
                  onClick={() => handleEditClick(category)}
                  className="btn btn-warning"
                >
                  Modifica
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h2>Modifica Categoria</h2>
            {selectedCategory && (
              <form onSubmit={handleUpdateCategory}>
                <div className="form-group">
                  <label htmlFor="name">Nome Categoria</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={selectedCategory.name}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subcategories">Sottocategorie</label>
                  {selectedCategory.subcategories.map((sub, index) => (
                    <div key={sub._id}>
                      <input
                        type="text"
                        id={`subcategory-${index}`}
                        defaultValue={sub.name}
                        required
                      />
                    </div>
                  ))}
                </div>
                <button type="submit" className="btn btn-primary">Aggiorna</button>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Annulla</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryEdit;
