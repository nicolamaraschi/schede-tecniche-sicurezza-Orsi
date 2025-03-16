// src/api.js
const API_URL = 'http://localhost:5002/api/prodottiCatalogo/prodotti';
const AUTH_URL = 'http://localhost:5002/api/auth';
const CATEGORIES_URL = 'http://localhost:5002/api/prodottiCatalogo/categoria';
const SUBCATEGORIES_URL = 'http://localhost:5002/api/prodottiCatalogo/sottocategorie';

// Funzione di supporto per gestire gli errori di autenticazione
const handleAuthError = (error) => {
  // Verifica se l'errore è di tipo 401 Unauthorized
  if (error.response && error.response.status === 401) {
    // Rimuovi il token dalla localStorage
    localStorage.removeItem('authToken');
    
    // Visualizza un messaggio all'utente
    alert('La tua sessione è scaduta. Per favore, effettua nuovamente il login.');
    
    // Reindirizza alla pagina di login
    window.location.href = '/login';
  }
  
  // Rilancia l'errore per permettere al chiamante di gestirlo ulteriormente se necessario
  throw error;
};

// Ottieni il token JWT dalla localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Funzione per creare un nuovo prodotto
export const createProdotto = async (prodotto, immagini) => {
  try {
    const formData = new FormData();
    
    // Aggiungi i dati del prodotto
    for (const key in prodotto) {
      formData.append(key, prodotto[key]);
    }
    
    // Aggiungi le immagini
    immagini.forEach((file) => {
      formData.append('immagini', file);
    });

    // Debug: Stampa il contenuto di FormData
    console.log('Contenuto di FormData:');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
    }

    const token = getAuthToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
      headers
    });

    if (response.status === 401) {
      throw { response: { status: 401 } };
    }

    if (!response.ok) {
      throw new Error('Errore durante la creazione del prodotto');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    handleAuthError(error);
    throw error;
  }
};

// Funzione per ottenere tutte le categorie (Domestico e Industriale)
export const getAllCategories = async () => {
  try {
    const token = getAuthToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(SUBCATEGORIES_URL, { headers });
    
    if (response.status === 401) {
      throw { response: { status: 401 } };
    }
    
    if (!response.ok) {
      throw new Error('Errore durante il recupero delle categorie');
    }
    
    return await response.json();
  } catch (error) {
    console.error(error);
    handleAuthError(error);
    throw error;
  }
};

// Funzione per ottenere le sottocategorie di una categoria
export const getSubcategoriesByCategory = async (categoria) => {
  try {
    const token = getAuthToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(`${CATEGORIES_URL}/${categoria}/sottocategorie`, { headers });
    
    if (response.status === 401) {
      throw { response: { status: 401 } };
    }
    
    if (!response.ok) {
      throw new Error('Errore durante il recupero delle sottocategorie');
    }
    
    return await response.json();
  } catch (error) {
    console.error(error);
    handleAuthError(error);
    throw error;
  }
};

// Funzione per aggiungere una sottocategoria
export const addSubcategory = async (categoria, sottocategoria) => {
  try {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    const response = await fetch(`${CATEGORIES_URL}/${categoria}/sottocategorie`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ sottocategoria })
    });
    
    if (response.status === 401) {
      throw { response: { status: 401 } };
    }
    
    if (!response.ok) {
      throw new Error('Errore durante l\'aggiunta della sottocategoria');
    }
    
    return await response.json();
  } catch (error) {
    console.error(error);
    handleAuthError(error);
    throw error;
  }
};

// Funzione per ottenere tutti i prodotti
export const getAllProdotti = async () => {
  try {
    const token = getAuthToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(API_URL, { headers });
    
    if (response.status === 401) {
      throw { response: { status: 401 } };
    }
    
    if (!response.ok) {
      throw new Error('Errore durante il recupero dei prodotti');
    }
    
    const data = await response.json();
    console.log('Prodotti recuperati:', data);
    return data;
  } catch (error) {
    console.error(error);
    handleAuthError(error);
    throw error;
  }
};

// Funzione per ottenere un prodotto per ID
export const getProdottoById = async (id) => {
  try {
    const token = getAuthToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(`${API_URL}/${id}`, { headers });
    
    if (response.status === 401) {
      throw { response: { status: 401 } };
    }
    
    if (!response.ok) {
      throw new Error('Errore durante il recupero del prodotto');
    }
    
    return await response.json();
  } catch (error) {
    console.error(error);
    handleAuthError(error);
    throw error;
  }
};

// Funzione per aggiornare un prodotto
export const updateProdotto = async (id, prodotto, immagini) => {
  try {
    const formData = new FormData();
    // Aggiungi i dati del prodotto
    for (const key in prodotto) {
      formData.append(key, prodotto[key]);
    }
    // Aggiungi le nuove immagini
    immagini.forEach((file) => {
      formData.append('immagini', file);
    });

    const token = getAuthToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      body: formData,
      headers
    });

    if (response.status === 401) {
      throw { response: { status: 401 } };
    }
    
    if (!response.ok) {
      throw new Error('Errore durante l\'aggiornamento del prodotto');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    handleAuthError(error);
    throw error;
  }
};

// Funzione per cancellare un prodotto
export const deleteProdotto = async (id) => {
  try {
    const token = getAuthToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers
    });

    if (response.status === 401) {
      throw { response: { status: 401 } };
    }
    
    if (!response.ok) {
      throw new Error('Errore durante la cancellazione del prodotto');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    handleAuthError(error);
    throw error;
  }
};

// Funzione per ottenere prodotti per categoria
export const getProdottiByCategoria = async (categoria) => {
  try {
    const token = getAuthToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(`${CATEGORIES_URL}/${categoria}`, { headers });
    
    if (response.status === 401) {
      throw { response: { status: 401 } };
    }
    
    if (!response.ok) {
      throw new Error('Errore durante il recupero dei prodotti per categoria');
    }
    
    return await response.json();
  } catch (error) {
    console.error(error);
    handleAuthError(error);
    throw error;
  }
};

// Funzione per ottenere prodotti per sottocategoria
export const getProdottiBySottocategoria = async (categoria, sottocategoria) => {
  try {
    const token = getAuthToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(`${CATEGORIES_URL}/${categoria}/sottocategoria/${sottocategoria}`, { headers });
    
    if (response.status === 401) {
      throw { response: { status: 401 } };
    }
    
    if (!response.ok) {
      throw new Error('Errore durante il recupero dei prodotti per sottocategoria');
    }
    
    return await response.json();
  } catch (error) {
    console.error(error);
    handleAuthError(error);
    throw error;
  }
};

// Funzione per registrare un nuovo utente
export const registerUtente = async (utente) => {
  try {
    const response = await fetch(`${AUTH_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(utente),
    });

    if (!response.ok) {
      throw new Error('Errore durante la registrazione');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Funzione per il login dell'utente
export const loginUtente = async (credentials) => {
  try {
    const response = await fetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Errore durante il login');
    }

    const data = await response.json();
    
    // Salva il token nella localStorage
    if (data && data.token) {
      localStorage.setItem('authToken', data.token);
    }
    
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Funzione per il logout
export const logoutUtente = () => {
  localStorage.removeItem('authToken');
  // Reindirizza alla pagina di login
  window.location.href = '/login';
};

// Funzione per verificare se l'utente è autenticato
export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};