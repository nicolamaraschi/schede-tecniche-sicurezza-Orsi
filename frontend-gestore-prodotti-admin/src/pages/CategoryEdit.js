// src/pages/CategoryEdit.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCategoryById, updateCategory } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { FaSave, FaUndo, FaPlus, FaMinus, FaLayerGroup } from 'react-icons/fa';
import './CategoryEdit.css';

const CategoryEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { checkTokenExpiration } = useAuth();

  const [categoryName, setCategoryName] = useState('');
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [newSubcategoryName, setNewSubcategoryName] = useState('');


  useEffect(() => {
    const loadCategory = async () => {
      try {
        setLoading(true);
        const data = await fetchCategoryById(id);
        setCategoryName(data.name);
        setSubcategories(data.subcategories || []);
      } catch (error) {
        if (checkTokenExpiration) {
          checkTokenExpiration(error);
        }
        showNotification('Errore durante il caricamento della categoria', 'danger');
        console.error('Error fetching category:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [id, checkTokenExpiration]);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 5000);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      showNotification('Il nome della categoria è obbligatorio', 'danger');
      return;
    }

    const invalidSubcategories = subcategories.filter(sub => !sub.name || !sub.name.trim());
    if (invalidSubcategories.length > 0) {
      showNotification('Tutte le sottocategorie devono avere un nome', 'danger');
      return;
    }

    try {
      const updatedCategoryData = {
        name: categoryName,
        subcategories: subcategories.map(({ name }) => ({ name })), // Invia solo il nome
      };

      await updateCategory(id, updatedCategoryData);
      showNotification('Categoria aggiornata con successo');
      setTimeout(() => navigate('/categories'), 2000); // Ritorna alla lista dopo 2 sec
    } catch (error) {
      if (checkTokenExpiration) {
        checkTokenExpiration(error);
      }
      showNotification('Errore durante l\'aggiornamento della categoria', 'danger');
      console.error('Error updating category:', error);
    }
  };

  const handleAddSubcategory = () => {
    if (!newSubcategoryName.trim()) {
        showNotification('Inserisci un nome per la sottocategoria', 'warning');
        return;
    }
    setSubcategories([...subcategories, { name: newSubcategoryName.trim() }]);
    setNewSubcategoryName('');
    showNotification('Sottocategoria aggiunta localmente. Salva per confermare.', 'info');
  };

  const handleRemoveSubcategory = (index) => {
    if (window.confirm('Sei sicuro di voler rimuovere questa sottocategoria? L\'azione sarà definitiva solo dopo aver salvato le modifiche.')) {
      const updatedSubcategories = [...subcategories];
      updatedSubcategories.splice(index, 1);
      setSubcategories(updatedSubcategories);
      showNotification('Sottocategoria rimossa localmente. Salva per confermare.', 'warning');
    }
  };

  const handleSubcategoryNameChange = (index, newName) => {
    const updatedSubcategories = [...subcategories];
    updatedSubcategories[index].name = newName;
    setSubcategories(updatedSubcategories);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Caricamento...</span>
        </div>
        <p>Caricamento dati categoria...</p>
      </div>
    );
  }

  return (
    <div className="category-edit-form-container">
      <div className="page-header">
        <h2>Modifica Categoria</h2>
        <p>Aggiorna il nome della categoria e gestisci le sue sottocategorie.</p>
      </div>

      {notification.show && (
        <div className={`alert alert-${notification.type} alert-dismissible fade show`}>
          {notification.message}
          <button
            type="button"
            className="btn-close"
            onClick={() => setNotification({ show: false, message: '', type: '' })}
          ></button>
        </div>
      )}

      <form onSubmit={handleUpdateCategory} className="edit-form">
        <div className="form-group">
          <label htmlFor="categoryName">Nome Categoria:</label>
          <input
            type="text"
            id="categoryName"
            name="categoryName"
            className="form-control"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
        </div>

        <div className="subcategories-section">
          <h4>
            <FaLayerGroup className="me-2" />
            Gestione Sottocategorie
          </h4>

          <div className="subcategories-manager">
            {subcategories.length > 0 ? (
              <div className="current-subcategories">
                <h5>Sottocategorie esistenti:</h5>
                <ul className="subcategories-edit-list">
                  {subcategories.map((sub, index) => (
                    <li key={sub._id || index} className="subcategory-edit-item">
                      <input
                        type="text"
                        className="form-control subcategory-input"
                        value={sub.name}
                        onChange={(e) => handleSubcategoryNameChange(index, e.target.value)}
                        placeholder="Nome sottocategoria"
                      />
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveSubcategory(index)}
                        title="Rimuovi sottocategoria"
                      >
                        <FaMinus />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="no-subcategories">Nessuna sottocategoria presente</p>
            )}

            <div className="add-subcategory">
              <h5>Aggiungi nuova sottocategoria:</h5>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  value={newSubcategoryName}
                  onChange={(e) => setNewSubcategoryName(e.target.value)}
                  placeholder="Nome nuova sottocategoria"
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddSubcategory}
                >
                  <FaPlus className="me-1" /> Aggiungi
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            <FaSave className="me-1" /> Salva Modifiche
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/categories')}>
            <FaUndo className="me-1" /> Annulla
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryEdit;