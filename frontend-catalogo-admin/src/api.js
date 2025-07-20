const API_BASE = 'https://orsi-production.up.railway.app/api';
const API_URL = API_BASE + '/prodottiCatalogo/prodotti';
const AUTH_URL = API_BASE + '/auth';
const CATEGORIES_URL = API_BASE + '/prodottiCatalogo/categoria';
const SUBCATEGORIES_URL = API_BASE + '/prodottiCatalogo/sottocategorie';

// Funzione di supporto per gestire gli errori di autenticazione
const handleAuthError = (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('authToken');
    alert('La tua sessione è scaduta. Per favore, effettua nuovamente il login.');
    window.location.href = '/login';
  }
  throw error;
};

const getAuthToken = () => localStorage.getItem('authToken');

export const createProdotto = async (prodotto, immagini) => {
  try {
    const formData = new FormData();
    for (const key in prodotto) formData.append(key, prodotto[key]);
    immagini.forEach((file) => formData.append('immagini', file));

    console.log('Contenuto di FormData:');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
    }

    const token = getAuthToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
      headers,
    });

    if (response.status === 401) throw { response: { status: 401 } };
    if (!response.ok) throw new Error('Errore durante la creazione del prodotto');

    return await response.json();
  } catch (error) {
    console.error(error);
    handleAuthError(error);
    throw error;
  }
};

export const getAllCategories = async () => {
  try {
    const token = getAuthToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await fetch(`${API_BASE}/prodottiCatalogo/categorie`, { headers }); // Nuovo endpoint

    if (response.status === 401) throw { response: { status: 401 } };
    if (!response.ok) throw new Error('Errore durante il recupero delle categorie');

    return await response.json();
  } catch (error) {
    console.error(error);
    handleAuthError(error);
    throw error;
  }
};

export const getSubcategoriesByCategory = async (categoria) => {
  try {
    const token = getAuthToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await fetch(`${CATEGORIES_URL}/${categoria}/sottocategorie`, { headers });

    if (response.status === 401) throw { response: { status: 401 } };
    if (!response.ok) throw new Error('Errore durante il recupero delle sottocategorie');

    return await response.json();
  } catch (error) {
    console.error(error);
    handleAuthError(error);
    throw error;
  }
};

export const addSubcategory = async (categoria, sottocategoria) => {
  try {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(`${CATEGORIES_URL}/${categoria}/sottocategorie`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ sottocategoria }), // Invia la sottocategoria come stringa
    });

    if (response.status === 401) throw { response: { status: 401 } };
    if (!response.ok) throw new Error('Errore durante l\'aggiunta della sottocategoria');

    return await response.json();
  } catch (error) {
    console.error(error);
    handleAuthError(error);
    throw error;
  }
};

export const getAllProdotti = async () => {
  try {
    const token = getAuthToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await fetch(API_URL, { headers });

    if (response.status === 401) throw { response: { status: 401 } };
    if (!response.ok) throw new Error('Errore durante il recupero dei prodotti');

    const data = await response.json();
    console.log('Prodotti recuperati:', data);

    // Non modificare i percorsi delle immagini, usa direttamente gli URL forniti dall'API
    return data;
  } catch (error) {
    console.error(error);
    handleAuthError(error);
    throw error;
  }
};


export const getProdottoById = async (id) => {
  try {
    const token = getAuthToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await fetch(`${API_URL}/${id}`, { headers });

    if (response.status === 401) throw { response: { status: 401 } };
    if (!response.ok) throw new Error('Errore durante il recupero del prodotto');

    const prodotto = await response.json();

    // Non modificare i percorsi delle immagini, usa direttamente gli URL forniti dall'API
    return prodotto;
  } catch (error) {
    console.error(error);
    handleAuthError(error);
    throw error;
  }
};


export const updateProdotto = async (id, prodotto, immagini, immaginiToRemove) => {
  try {
    const formData = new FormData();

    // Append product data
    for (const key in prodotto) {
      // Skip immaginiToRemove here, as it will be handled separately
      if (key === 'immaginiToRemove') continue;
      formData.append(key, prodotto[key]);
    }

    // Append new images
    immagini.forEach((file) => formData.append('immagini', file));

    // Append images to remove, each as a separate field
    immaginiToRemove.forEach((url) => formData.append('immaginiToRemove', url));

    const token = getAuthToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      body: formData,
      headers,
    });

    if (response.status === 401) throw { response: { status: 401 } };
    if (!response.ok) throw new Error('Errore durante l\'aggiornamento del prodotto');

    return await response.json();
  } catch (error) {
    console.error(error);
    handleAuthError(error);
    throw error;
  }
};




export const deleteProdotto = async (id) => {
  try {
    const token = getAuthToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (response.status === 401) throw { response: { status: 401 } };
    if (!response.ok) throw new Error('Errore durante la cancellazione del prodotto');

    return await response.json();
  } catch (error) {
    console.error(error);
    handleAuthError(error);
    throw error;
  }
};

export const getProdottiByCategoria = async (categoria) => {
  try {
    const token = getAuthToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await fetch(`${CATEGORIES_URL}/${categoria}`, { headers });

    if (response.status === 401) throw { response: { status: 401 } };
    if (!response.ok) throw new Error('Errore durante il recupero dei prodotti per categoria');

    const data = await response.json();

    // Non modificare i percorsi delle immagini, usa direttamente gli URL forniti dall'API
    return data;
  } catch (error) {
    console.error(error);
    handleAuthError(error);
    throw error;
  }
};


export const getProdottiBySottocategoria = async (categoria, sottocategoria) => {
  try {
    const token = getAuthToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await fetch(`${CATEGORIES_URL}/${categoria}/sottocategoria/${sottocategoria}`, { headers });

    if (response.status === 401) throw { response: { status: 401 } };
    if (!response.ok) throw new Error('Errore durante il recupero dei prodotti per sottocategoria');

    const data = await response.json();

    // Non modificare i percorsi delle immagini, usa direttamente gli URL forniti dall'API
    return data;
  } catch (error) {
    console.error(error);
    handleAuthError(error);
    throw error;
  }
};

export const registerUtente = async (utente) => {
  try {
    const response = await fetch(`${AUTH_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(utente),
    });

    if (!response.ok) throw new Error('Errore durante la registrazione');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const loginUtente = async (credentials) => {
  try {
    console.log('Login URL:', `${API_BASE}/login`);
    console.log('Credentials:', credentials);

    const response = await fetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    console.log('Response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Login Error Response:', errorText);
      throw new Error(errorText || 'Errore durante il login');
    }

    const data = await response.json();
    if (data && data.token) localStorage.setItem('authToken', data.token);
    return data;
  } catch (error) {
    console.error('Detailed Login Error:', {
      message: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

export const logoutUtente = () => {
  localStorage.removeItem('authToken');
  window.location.href = '/login';
};

// Funzione per verificare se l'utente è autenticato
export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};