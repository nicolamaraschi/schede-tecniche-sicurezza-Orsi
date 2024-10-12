// src/api.js
const API_URL = 'http://localhost:5002/api/prodottiCatalogo/prodotti'; // Modifica con l'URL corretto
const AUTH_URL = 'http://localhost:5002/api/auth'; // URL per le API di autenticazione
// Funzione per creare un nuovo prodotto
export const createProdotto = async (prodotto) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prodotto),
    });

    if (!response.ok) {
      throw new Error('Errore durante la creazione del prodotto');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Funzione per ottenere tutti i prodotti
export const getAllProdotti = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Errore durante il recupero dei prodotti');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Funzione per ottenere un prodotto per ID
export const getProdottoById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error('Errore durante il recupero del prodotto');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Funzione per aggiornare un prodotto
export const updateProdotto = async (id, prodotto) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prodotto),
    });

    if (!response.ok) {
      throw new Error('Errore durante l\'aggiornamento del prodotto');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Funzione per cancellare un prodotto
export const deleteProdotto = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Errore durante la cancellazione del prodotto');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
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

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};