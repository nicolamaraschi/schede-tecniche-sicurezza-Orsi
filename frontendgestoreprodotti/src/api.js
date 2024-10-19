const API_URL = 'http://localhost:5002/api/gestoreProdotti'; // Aggiorna questo se cambi l'endpoint


// Funzioni per le API dei prodotti
export const fetchProducts = async () => {
  const response = await fetch(`${API_URL}/prodotti`); // Corretto il percorso
  if (!response.ok) throw new Error('Error fetching products');
  const products = await response.json();
  console.log('Prodotti ricevuti:', products);
  return products;
};

// Funzione per creare un prodotto
// Funzione per creare un prodotto
export const createProduct = async (product, images) => {
  const formData = new FormData(); // Crea un oggetto FormData

  // Aggiungi i dati del prodotto a FormData
  formData.append('name', product.name);
  formData.append('description', product.description);
  formData.append('category', product.category);
  
  // Aggiungi subcategory come oggetto, non come stringa
  formData.append('subcategory[id]', product.subcategory.id);
  formData.append('subcategory[name]', product.subcategory.name);
  
  // Aggiungi le immagini a FormData
  images.forEach(image => {
    formData.append('images', image); // Aggiungi ogni immagine
  });

  // Logga il contenuto di FormData
  console.log('Product data being sent:', product); // Logga i dati del prodotto

  try {
    const response = await fetch('http://localhost:5002/api/gestoreProdotti/prodotti', {
      method: 'POST',
      body: formData, // Invia FormData
      // Non impostare Content-Type, il browser lo gestirà automaticamente
    });

    if (!response.ok) {
      throw new Error('Error creating product: ' + response.statusText);
    }

    return await response.json(); // Restituisci il JSON della risposta
  } catch (error) {
    console.error('Error creating product:', error);
    throw error; // Propaga l'errore
  }
};














export const updateProduct = async (productId, updatedProductData, images, imagesToRemove) => {
  try {
      const formData = new FormData();

      // Verifica se updatedProductData è valido e contiene i dati necessari
      if (!updatedProductData || !updatedProductData.name || !updatedProductData.description || !updatedProductData.category || !updatedProductData.subcategory) {
          console.error('Dati del prodotto non validi:', updatedProductData);
          throw new Error('I dati del prodotto sono incompleti o non validi.');
      }

      // Aggiungi i dati del prodotto a FormData
      formData.append('name', updatedProductData.name);
      formData.append('description', updatedProductData.description);
      formData.append('category', updatedProductData.category);

      // Invia subcategory come oggetto (senza JSON.stringify)
      formData.append('subcategory[id]', updatedProductData.subcategory.id); // Aggiungi ID
      formData.append('subcategory[name]', updatedProductData.subcategory.name); // Aggiungi nome

      // Log dei dati aggiunti a FormData
      console.log('Dati del prodotto aggiunti al FormData:', {
          name: updatedProductData.name,
          description: updatedProductData.description,
          category: updatedProductData.category,
          subcategory: updatedProductData.subcategory, // Logga qui per vedere se è corretto
          images: images.map(img => img.name) // Nome delle immagini
      });

      // Aggiungi le immagini a FormData
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






  export const fetchProductByCode = async (id) => {
      const response = await fetch(`${API_URL}/prodotti/codice/${id}`); 
      if (!response.ok) throw new Error('Error fetching product by code');
      const product = await response.json();
      console.log('Prodotto ricevuto per codice:', product);
      return product;
    };

    export const deleteProduct = async (id) => {
      const response = await fetch(`${API_URL}/prodotti/${id}`, { // Corretto il percorso
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error deleting product');
      console.log('Prodotto eliminato con ID:', id);
  };


// Funzioni per le API delle categorie
export const fetchCategories = async () => {
  const response = await fetch(`${API_URL}/categorie`); // Corretto il percorso
  if (!response.ok) throw new Error('Error fetching categories');
  const categories = await response.json();
  console.log('Categorie ricevute:', categories);
  return categories;
};

export const createCategory = async (category) => {
  console.log('Invio dati per la creazione della categoria:', category);
  
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
  
  const createdCategory = await response.json();
  console.log('Categoria creata:', createdCategory);
  return createdCategory;
};

export const addSubcategory = async (categoryId, subcategory) => {
  console.log('Invio dati per aggiungere la sottocategoria:', subcategory);

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

  const addedSubcategory = await response.json();
  console.log('Sottocategoria aggiunta:', addedSubcategory);
  return addedSubcategory;
};

export const updateCategory = async (id, category) => {
  console.log('Invio dati per aggiornare la categoria con ID:', id, category);

  const response = await fetch(`${API_URL}/categorie/${id}`, { // Corretto il percorso
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(category),
  });
  
  if (!response.ok) throw new Error('Error updating category');
  
  const updatedCategory = await response.json();
  console.log('Categoria aggiornata:', updatedCategory);
  return updatedCategory; // Aggiunto il ritorno della risposta
};

export const deleteCategory = async (id) => {
  console.log('Richiesta di eliminazione della categoria con ID:', id);

  const response = await fetch(`${API_URL}/categorie/${id}`, { // Corretto il percorso
    method: 'DELETE',
  });
  
  if (!response.ok) throw new Error('Error deleting category');
  
  console.log('Categoria eliminata con successo:', id);
};

// Funzione per ottenere una categoria per ID
export const fetchCategoryById = async (id) => {
  const response = await fetch(`${API_URL}/categorie/${id}`); // Corretto il percorso
  if (!response.ok) throw new Error('Error fetching category by ID');
  
  const category = await response.json();
  console.log('Categoria ricevuta per ID:', category);
  return category;
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
