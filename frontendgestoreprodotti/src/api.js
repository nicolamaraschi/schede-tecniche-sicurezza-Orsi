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


export const updateProduct = async (productId, updatedProductData, images, imagesToRemove) => {
  try {
      const formData = new FormData();

      // Verifica se updatedProductData è valido e contiene i dati necessari
      if (!updatedProductData || !updatedProductData.name || !updatedProductData.description || !updatedProductData.category) {
          console.error('Dati del prodotto non validi:', updatedProductData);
          throw new Error('I dati del prodotto sono incompleti o non validi.');
      }

      // Aggiungi i dati del prodotto a FormData
      formData.append('name', updatedProductData.name);
      formData.append('description', updatedProductData.description);

      // Aggiungi il nome della categoria al FormData, se esiste
      if (typeof updatedProductData.category === 'string') {
          formData.append('category', updatedProductData.category);
      } else if (updatedProductData.category && updatedProductData.category.name) {
          formData.append('category', updatedProductData.category.name);
      } else {
          console.error('Categoria non valida:', updatedProductData.category);
          throw new Error('La categoria del prodotto non è valida.');
      }

      // Log dei dati aggiunti a FormData
      console.log('Dati del prodotto aggiunti al FormData:', {
          name: updatedProductData.name,
          description: updatedProductData.description,
          category: formData.get('category')
      });

      // Immagini da aggiungere
      if (images && images.length > 0) {
          images.forEach(image => {
              formData.append('images', image);
              console.log('Immagine aggiunta al FormData:', image.name);
          });
      } else {
          console.log('Nessuna immagine da aggiungere.');
      }

      // Immagini da rimuovere
      if (imagesToRemove && imagesToRemove.length > 0) {
          imagesToRemove.forEach(image => {
              formData.append('removeImages', image);
              console.log('Immagine da rimuovere aggiunta al FormData:', image);
          });
      } else {
          console.log('Nessuna immagine da rimuovere.');
      }

      console.log('Invio richiesta per aggiornare il prodotto con ID:', productId);

      // Invio della richiesta
      const response = await fetch(`${API_URL}/prodotti/${productId}`, {
          method: 'PUT',
          body: formData,
      });

      // Controllo dello stato della risposta
      if (!response.ok) {
          const errorText = await response.text();
          console.error('Errore nella risposta del server:', errorText);
          throw new Error('Errore durante l\'aggiornamento del prodotto');
      }

      const responseData = await response.json();
      console.log('Risposta del server:', responseData);

      return responseData;
  } catch (error) {
      console.error('Errore durante l\'aggiornamento del prodotto:', error);
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
