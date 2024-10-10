import React, { useState, useEffect } from 'react';
import { createCategory, fetchCategories, addSubcategory } from '../api'; // Assicurati di importare la funzione addSubcategory
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CategoryCreate.css';

const CategoryCreate = () => {
  // Stato per creare una nuova categoria
  const [name, setName] = useState('');

  // Stato per aggiungere una sottocategoria a una categoria esistente
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');

  const navigate = useNavigate();

  // Effettua il fetch delle categorie disponibili all'inizio
  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const categoriesList = await fetchCategories();
        setCategories(categoriesList);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAllCategories();
  }, []);

  // Gestisci la creazione di una nuova categoria
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    const category = { 
      name 
    };

    try {
      await createCategory(category);
      alert('Categoria creata con successo!');
      navigate('/categories'); // Redirect alla pagina delle categorie
      // Resetta il campo dopo la creazione
      setName('');
    } catch (error) {
      console.error(error);
    }
  };

  // Gestisci l'aggiunta di una sottocategoria
  const handleAddSubcategory = async (e) => {
    e.preventDefault();
    
    const subcategory = {
      name: subcategoryName // Nome della sottocategoria
    };

    try {
      await addSubcategory(selectedCategory, subcategory); // Usa la funzione per aggiungere la sottocategoria
      alert('Sottocategoria aggiunta con successo!');
      // Resetta i campi dopo l'aggiunta
      setSelectedCategory('');
      setSubcategoryName('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Card per creare una nuova categoria */}
        <div className="col-md-6">
          <div className="bg-light p-4 rounded shadow custom-card mb-4">
            <h3 className="text-center mb-4">🌿 Crea Nuova Categoria 🌿</h3>
            <form onSubmit={handleCreateCategory}>
              <div className="mb-3">
                <label className="form-label">Nome Categoria:</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">Crea Categoria</button>
            </form>
          </div>
        </div>

        {/* Card per aggiungere una sottocategoria a una categoria esistente */}
        <div className="col-md-6">
          <div className="bg-light p-4 rounded shadow custom-card">
            <h3 className="text-center mb-4">➕ Aggiungi Sottocategoria ➕</h3>
            <form onSubmit={handleAddSubcategory}>
              <div className="mb-3">
                <label className="form-label">Seleziona Categoria:</label>
                <select 
                  className="form-control" 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)} 
                  required
                >
                  <option value="">Seleziona una categoria</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Nuova Sottocategoria:</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={subcategoryName} 
                  onChange={(e) => setSubcategoryName(e.target.value)} 
                  required 
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">Aggiungi Sottocategoria</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCreate;
