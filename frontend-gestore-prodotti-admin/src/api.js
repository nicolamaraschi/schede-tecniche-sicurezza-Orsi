const API_URL = 'https://orsi-production.up.railway.app/api/gestoreProdotti';
const AUTH_URL = 'https://orsi-production.up.railway.app/api/auth';

// Funzione per ottenere l'intestazione di autorizzazione
export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Funzioni per le API di autenticazione
export const loginUtente = async (userData) => {
  try {
    const response = await fetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Error logging in user');
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const registerUtente = async (userData) => {
  try {
    const response = await fetch(`${AUTH_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error registering user');
    }
    
    return response.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Funzioni per le API dei prodotti
export const fetchProducts = async () => {
  try {
    const authHeader = getAuthHeader();
    
    const response = await fetch(`${API_URL}/prodotti`, {
      headers: {
        ...authHeader
      }
    });
    
    // Verifica se il token è scaduto o non valido
    if (response.status === 401) {
      throw new Error('Invalid or expired token');
    }
    
    if (!response.ok) {
      throw new Error('Error fetching products');
    }
    
    const products = await response.json();
    
    // Non modificare i percorsi delle immagini, usa direttamente gli URL forniti dall'API
    console.log('Prodotti ricevuti:', products);
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};


export const createProduct = async (product, images) => {
  try {
    const authHeader = getAuthHeader();
    const formData = new FormData();

    // Aggiungi i dati del prodotto a FormData
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('category', product.category);
    
    // Aggiungi subcategory come oggetto, non come stringa
    formData.append('subcategory[id]', product.subcategory.id);
    formData.append('subcategory[name]', product.subcategory.name);
    
    // Aggiungi le immagini a FormData
    images.forEach(image => {
      formData.append('images', image);
    });

    const response = await fetch(`${API_URL}/prodotti`, {
      method: 'POST',
      headers: {
        ...authHeader
      },
      body: formData,
    });

    // Verifica se il token è scaduto o non valido
    if (response.status === 401) {
      throw new Error('Invalid or expired token');
    }

    if (!response.ok) {
      throw new Error('Error creating product: ' + response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const fetchProductByCode = async (id) => {
  try {
    const authHeader = getAuthHeader();
    
    const response = await fetch(`${API_URL}/prodotti/codice/${id}`, {
      headers: {
        ...authHeader
      }
    });
    
    if (response.status === 401) {
      throw new Error('Invalid or expired token');
    }
    
    if (!response.ok) {
      throw new Error('Error fetching product by code');
    }
    
    const product = await response.json();
    
    // Non modificare i percorsi delle immagini, usa direttamente gli URL forniti dall'API
    console.log('Prodotto ricevuto per codice:', product);
    return product;
  } catch (error) {
    console.error('Error fetching product by code:', error);
    throw error;
  }
};

export const updateProduct = async (productId, updatedProductData, images, imagesToRemove) => {
  try {
    const authHeader = getAuthHeader();
    const formData = new FormData();

    // Verifica se updatedProductData è valido
    if (!updatedProductData || !updatedProductData.name || !updatedProductData.description || !updatedProductData.category || !updatedProductData.subcategory) {
      console.error('Dati del prodotto non validi:', updatedProductData);
      throw new Error('I dati del prodotto sono incompleti o non validi.');
    }

    // Aggiungi i dati del prodotto a FormData
    formData.append('name', updatedProductData.name);
    formData.append('description', updatedProductData.description);
    formData.append('category', updatedProductData.category);
    formData.append('subcategory[id]', updatedProductData.subcategory.id);
    formData.append('subcategory[name]', updatedProductData.subcategory.name);

    // Aggiungi le immagini
    if (images && images.length > 0) {
      images.forEach(image => {
        formData.append('images', image);
        console.log('Immagine aggiunta al FormData:', image.name);
      });
    }

    // Aggiungi le immagini da rimuovere (usa gli URL completi)
    if (imagesToRemove && imagesToRemove.length > 0) {
      imagesToRemove.forEach(image => {
        formData.append('removeImages', image);
        console.log('Immagine da rimuovere aggiunta al FormData:', image);
      });
    }

    console.log('Invio richiesta per aggiornare il prodotto con ID:', productId);

    // Invia la richiesta
    const response = await fetch(`${API_URL}/prodotti/${productId}`, {
      method: 'PUT',
      headers: {
        ...authHeader
      },
      body: formData,
    });

    // Verifica se il token è scaduto o non valido
    if (response.status === 401) {
      throw new Error('Invalid or expired token');
    }

    // Controllo della risposta
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Errore nella risposta del server:', errorText);
      throw new Error(`Errore durante l'aggiornamento del prodotto: ${errorText}`);
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
  try {
    const authHeader = getAuthHeader();
    
    const response = await fetch(`${API_URL}/prodotti/${id}`, {
      method: 'DELETE',
      headers: {
        ...authHeader
      }
    });
    
    if (response.status === 401) {
      throw new Error('Invalid or expired token');
    }
    
    if (!response.ok) {
      throw new Error('Error deleting product');
    }
    
    console.log('Prodotto eliminato con ID:', id);
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};
// Funzioni per le API delle categorie
export const fetchCategories = async () => {
  try {
    const authHeader = getAuthHeader();
    
    const response = await fetch(`${API_URL}/categorie`, {
      headers: {
        ...authHeader
      }
    });
    
    if (response.status === 401) {
      throw new Error('Invalid or expired token');
    }
    
    if (!response.ok) {
      throw new Error('Error fetching categories');
    }
    
    const categories = await response.json();
    console.log('Categorie ricevute:', categories);
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const createCategory = async (category) => {
  try {
    const authHeader = getAuthHeader();
    console.log('Invio dati per la creazione della categoria:', category);
    
    const response = await fetch(`${API_URL}/categorie`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader
      },
      body: JSON.stringify(category),
    });
    
    if (response.status === 401) {
      throw new Error('Invalid or expired token');
    }
    
    if (!response.ok) {
      throw new Error('Error creating category');
    }
    
    const createdCategory = await response.json();
    console.log('Categoria creata:', createdCategory);
    return createdCategory;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const addSubcategory = async (categoryId, subcategory) => {
  try {
    const authHeader = getAuthHeader();
    console.log('Invio dati per aggiungere la sottocategoria:', subcategory);

    const response = await fetch(`${API_URL}/categorie/${categoryId}/sottocategorie`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader
      },
      body: JSON.stringify(subcategory),
    });

    if (response.status === 401) {
      throw new Error('Invalid or expired token');
    }
    
    if (!response.ok) {
      throw new Error('Error adding subcategory');
    }

    const addedSubcategory = await response.json();
    console.log('Sottocategoria aggiunta:', addedSubcategory);
    return addedSubcategory;
  } catch (error) {
    console.error('Error adding subcategory:', error);
    throw error;
  }
};

export const updateCategory = async (id, category) => {
  try {
    const authHeader = getAuthHeader();
    console.log('Invio dati per aggiornare la categoria con ID:', id, category);

    const response = await fetch(`${API_URL}/categorie/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader
      },
      body: JSON.stringify(category),
    });
    
    if (response.status === 401) {
      throw new Error('Invalid or expired token');
    }
    
    if (!response.ok) {
      throw new Error('Error updating category');
    }
    
    const updatedCategory = await response.json();
    console.log('Categoria aggiornata:', updatedCategory);
    return updatedCategory;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const authHeader = getAuthHeader();
    console.log('Richiesta di eliminazione della categoria con ID:', id);

    const response = await fetch(`${API_URL}/categorie/${id}`, {
      method: 'DELETE',
      headers: {
        ...authHeader
      }
    });
    
    if (response.status === 401) {
      throw new Error('Invalid or expired token');
    }
    
    if (!response.ok) {
      throw new Error('Error deleting category');
    }
    
    console.log('Categoria eliminata con successo:', id);
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

export const fetchCategoryById = async (id) => {
  try {
    const authHeader = getAuthHeader();
    
    const response = await fetch(`${API_URL}/categorie/${id}`, {
      headers: {
        ...authHeader
      }
    });
    
    if (response.status === 401) {
      throw new Error('Invalid or expired token');
    }
    
    if (!response.ok) {
      throw new Error('Error fetching category by ID');
    }
    
    const category = await response.json();
    console.log('Categoria ricevuta per ID:', category);
    return category;
  } catch (error) {
    console.error('Error fetching category by ID:', error);
    throw error;
  }
};

// Funzione per verificare la validità del token
export const verifyToken = async () => {
  try {
    const authHeader = getAuthHeader();
    // Puoi creare un endpoint sul tuo backend che verifica solo il token
    // Per ora, utilizziamo un endpoint esistente come le categorie
    const response = await fetch(`${API_URL}/categorie`, {
      headers: {
        ...authHeader
      }
    });
    
    return response.status !== 401;
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
};