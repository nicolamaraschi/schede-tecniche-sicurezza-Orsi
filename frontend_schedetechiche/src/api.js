// src/api.js
import { getToken, isTokenExpired, removeToken } from './services/authService';

// Usa la variabile d'ambiente per la base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api'; // Default per lo sviluppo

// Funzione di utilità per ottenere il token corrente o reindirizzare se è scaduto
const getAuthToken = () => {
  // Se viene usato il nuovo sistema di autenticazione
  if (typeof getToken === 'function') {
    if (isTokenExpired()) {
      removeToken();
      window.location.href = '/login';
      throw new Error('Il token è scaduto. Effettua nuovamente il login.');
    }
    return getToken();
  }
  
  // Fallback al vecchio sistema
  return localStorage.getItem('token');
};

// API per i documenti
export const fetchDocuments = async (token, productCode = '') => {
  // Usa il token fornito o ottienilo automaticamente
  const authToken = token || getAuthToken();
  
  const url = productCode
    ? `${API_BASE_URL}/documents/${productCode}`
    : `${API_BASE_URL}/documents`;

  console.log('Fetching documents from:', url); // Debugging
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    // Gestisci errori di autenticazione
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Sessione scaduta. Effettua nuovamente il login.');
    }
    throw new Error('Errore nel recupero dei documenti');
  }

  const data = await response.json();
  console.log('Documents fetched:', data); // Debugging the fetched data

  // Mappa i documenti per includere il codice documento
  const documents = data.map(doc => ({
    idDocument: doc.idDocument,
    productName: doc.productName,
    productCode: doc.productCode,
    documentType: doc.documentType,
    fileUrl: doc.fileUrl,
    documentCode: doc.documentCode, // Aggiungi il codice del documento
  }));

  return documents; // Restituisce i documenti con il codice documento incluso
};

export const uploadDocument = async (token, selectedFile, selectedProductName, uploadType, documentCode) => {
  // Usa il token fornito o ottienilo automaticamente
  const authToken = token || getAuthToken();
  
  const formData = new FormData();
  formData.append('file', selectedFile);
  formData.append('productName', selectedProductName); // Usato il nome del prodotto
  formData.append('type', uploadType);
  formData.append('documentCode', documentCode); // Aggiungi il documentCode

  // Debug: Stampa i dati del FormData
  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      // Gestisci errori di autenticazione
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Sessione scaduta. Effettua nuovamente il login.');
      }
      
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || 'Errore nel caricamento del documento');
    }

    return await response.json();
  } catch (error) {
    console.error('Upload document error:', error);
    throw error;
  }
};

// Funzione corretta di deleteDocument per api.js

export const deleteDocument = async (token, documentId) => {
  if (!documentId) {
    throw new Error('ID documento mancante');
  }
  
  console.log('Deleting document with ID:', documentId);
  
  try {
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      // Log dettagliato dell'errore
      const errorStatus = response.status;
      const errorText = await response.text();
      console.error(`Error status: ${errorStatus}, Response: ${errorText}`);
      
      throw new Error(`Errore nella cancellazione del documento: ${errorStatus}`);
    }
    
    // Se la risposta non ha un corpo o non è JSON, restituisci un messaggio di successo
    try {
      return await response.json();
    } catch (e) {
      // Se non possiamo analizzare la risposta come JSON, restituisci un messaggio di successo predefinito
      return { message: 'Documento eliminato con successo' };
    }
  } catch (error) {
    console.error('Error in deleteDocument:', error);
    throw error;
  }
};

export const fetchDocumentId = async (token, productCode, productName) => {
  // Usa il token fornito o ottienilo automaticamente
  const authToken = token || getAuthToken();
  
  try {
    const url = `${API_BASE_URL}/documents/${productCode}/${encodeURIComponent(productName)}`;
    console.log(`Fetching document ID from URL: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Gestisci errori di autenticazione
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Sessione scaduta. Effettua nuovamente il login.');
      }
      throw new Error(`Errore nel recupero dell'ID del documento: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      idDocument: data.idDocument, // Restituisce l'ID del documento
      documentCode: data.documentCode // Restituisce il codice del documento
    };
  } catch (error) {
    console.error('Error fetching document ID:', error);
    throw error; // Rilancia l'errore per la gestione nel chiamante
  }
};

export const fetchDocumentByCode = async (token, documentCode) => {
  // Usa il token fornito o ottienilo automaticamente
  const authToken = token || getAuthToken();
  
  const url = `${API_BASE_URL}/documents/code/${documentCode}`; // Usa l'endpoint corretto

  console.log('Fetching document by code from:', url); // Debugging
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    // Gestisci errori di autenticazione
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Sessione scaduta. Effettua nuovamente il login.');
    }
    throw new Error('Errore nel recupero del documento');
  }

  const data = await response.json();
  console.log('Document fetched:', data); // Debugging the fetched data

  // Mappa il documento per includere tutti i campi necessari
  const document = {
    idDocument: data.idDocument,
    documentCode: data.documentCode,
    documentType: data.type, // Cambiato per corrispondere alla risposta
    fileUrl: data.fileUrl,
    productName: data.productName, // Aggiunto il nome del prodotto
    productCode: data.productCode,   // Aggiunto il codice del prodotto
  };

  return document; // Restituisce il documento trovato
};

export const createProduct = async (token, newProductName, newProductCode) => {
  // Usa il token fornito o ottienilo automaticamente
  const authToken = token || getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
    body: JSON.stringify({ name: newProductName, code: newProductCode }),
  });

  if (!response.ok) {
    // Gestisci errori di autenticazione
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Sessione scaduta. Effettua nuovamente il login.');
    }
    throw new Error('Errore nella creazione del prodotto');
  }
  
  return await response.json();
};

export const fetchProducts = async (token) => {
  // Usa il token fornito o ottienilo automaticamente
  const authToken = token || getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/products`, {
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });
  
  if (!response.ok) {
    // Gestisci errori di autenticazione
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Sessione scaduta. Effettua nuovamente il login.');
    }
    throw new Error('Errore nel recupero dei prodotti');
  }
  
  return await response.json();
};

export const deleteProduct = async (token, productCode, productName) => {
  // Usa il token fornito o ottienilo automaticamente
  const authToken = token || getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/products/${productCode}/${productName}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    // Gestisci errori di autenticazione
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Sessione scaduta. Effettua nuovamente il login.');
    }
    throw new Error(`Errore nella cancellazione del prodotto: ${response.status}`);
  }

  return response.json(); // Opzionale, puoi restituire il messaggio di successo
};

// API per l'autenticazione
export const loginUser = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Errore durante il login');
  }
  
  return data; // Contiene { token: '...' }
};

// API per documenti pubblici (senza autenticazione)
export const fetchPublicDocumentByCode = async (documentCode) => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents/public/code/${documentCode}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Errore sconosciuto' }));
      throw new Error(errorData.message || `Errore HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching public document:', error);
    throw error;
  }
};