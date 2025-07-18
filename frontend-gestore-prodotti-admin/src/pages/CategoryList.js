
import React, { useEffect, useState } from 'react';
import { fetchCategories, deleteCategory } from '../api';
import { Link } from 'react-router-dom';
import './CategoryList.css';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategoryList();
  }, []);

  const fetchCategoryList = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      fetchCategoryList();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Elenco delle Categorie</h2>
      <Link to="/categories/create" className="btn btn-primary mb-3">Crea Nuova Categoria</Link>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Sottocategorie</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category._id}>
              <td>{category.name}</td>
              <td>
                {category.subcategories.map((sub, index) => (
                  <div key={index}>{sub.name}</div>
                ))}
              </td>
              <td>
                <Link to={`/categories/edit/${category._id}`} className="btn btn-warning mr-2">Modifica</Link>
                <button onClick={() => handleDelete(category._id)} className="btn btn-danger">Elimina</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList;
