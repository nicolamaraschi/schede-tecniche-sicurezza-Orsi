const API_URL = 'http://localhost:5002/api/gestoreProdotti'; // Aggiorna questo se cambi l'endpoint

// Funzioni per le API dei prodotti
export const fetchProducts = async () => {
  const response = await fetch(`${API_URL}/prodotti`); // Corretto il percorso
  if (!response.ok) throw new Error('Error fetching products');
  return response.json();
};

export const createProduct = async (product, images) => {
  const formData = new FormData();
  
  // Aggiungi i dati del prodotto a FormData
  formData.append('name', product.name);
  formData.append('description', product.description);
  formData.append('category', product.category);

  // Aggiungi le immagini a FormData
  images.forEach((image) => {
    formData.append('images', image); // 'images' deve corrispondere al nome dell'input nel middleware multer
  });

  const response = await fetch(`${API_URL}/prodotti`, { // Corretto il percorso
    method: 'POST',
    body: formData, // Usa FormData qui
  });
  
  if (!response.ok) throw new Error('Error creating product');
  return response.json();
};


// Funzione per aggiornare un prodotto
export const updateProduct = async (productId, updatedProductData, images, imagesToRemove) => {
  try {
      // Crea un'istanza di FormData per gestire i dati e le immagini
      const formData = new FormData();
      
      // Aggiungi i dati del prodotto al FormData
      formData.append('name', updatedProductData.name);
      formData.append('description', updatedProductData.description);
      formData.append('category', updatedProductData.category);

      // Aggiungi le immagini se esistono
      if (images && images.length > 0) {
          images.forEach(image => {
              formData.append('images', image); // Assicurati che il nome del campo corrisponda a quello gestito nel backend
          });
      }

      // Aggiungi le immagini da rimuovere se esistono
      if (imagesToRemove && imagesToRemove.length > 0) {
          // Puoi scegliere di passare le immagini da rimuovere come un array
          imagesToRemove.forEach(image => {
              formData.append('removeImages', image); // Assicurati che il nome del campo corrisponda a quello gestito nel backend
          });
      }

      // Effettua la richiesta fetch per aggiornare il prodotto
      const response = await fetch(`/api/products/${productId}`, {
          method: 'PUT',
          body: formData, // Invia il form data
      });

      // Logga la risposta completa del server per diagnosi
      const responseData = await response.json();
      console.log('Server response:', responseData);

      // Verifica se la risposta è ok
      if (!response.ok) {
          throw new Error('Errore durante l\'aggiornamento del prodotto');
      }

      return responseData;
  } catch (error) {
      console.error('Error updating product:', error);
      throw error;
  }
};


export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/prodotti/${id}`, { // Corretto il percorso
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Error deleting product');
};


// Funzioni per le API delle categorie
export const fetchCategories = async () => {
  const response = await fetch(`${API_URL}/categorie`); // Corretto il percorso
  if (!response.ok) throw new Error('Error fetching categories');
  return response.json();
};

export const createCategory = async (category) => {
  const response = await fetch(`${API_URL}/categorie`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(category),
  });
  
  if (!response.ok) {
    throw new Error('Error creating category');
  }
  
  return response.json();
};

export const addSubcategory = async (categoryId, subcategory) => {
  const response = await fetch(`${API_URL}/categorie/${categoryId}/sottocategorie`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(subcategory),
  });

  if (!response.ok) {
      throw new Error('Error adding subcategory');
  }

  return response.json();
};




export const updateCategory = async (id, category) => {
  const response = await fetch(`${API_URL}/categorie/${id}`, { // Corretto il percorso
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(category),
  });
  if (!response.ok) throw new Error('Error updating category');
  return response.json(); // Aggiunto il ritorno della risposta
};

export const deleteCategory = async (id) => {
  const response = await fetch(`${API_URL}/categorie/${id}`, { // Corretto il percorso
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Error deleting category');
};




// Funzione per ottenere un prodotto per codice
export const fetchProductByCode = async (id) => {
  const response = await fetch(`${API_URL}/prodotti/codice/${id}`); // Corretto il percorso
  if (!response.ok) throw new Error('Error fetching product by code');
  return response.json();
};

// Funzione per ottenere una categoria per ID
export const fetchCategoryById = async (id) => {
  const response = await fetch(`${API_URL}/categorie/${id}`); // Corretto il percorso
  if (!response.ok) throw new Error('Error fetching category by ID');
  return response.json();
};





// Funzioni per le API di autenticazione
export const registerUtente = async (userData) => {
  const response = await fetch(`http://localhost:5002/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error('Error registering user');
  return response.json();
};



export const loginUtente = async (userData) => {
  const response = await fetch(`http://localhost:5002/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData), // Assicurati che userData contenga username e password
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Login failed with status:', response.status, 'and message:', data);
    throw new Error(data.message || 'Error logging in user');
  }
  return data;
};
