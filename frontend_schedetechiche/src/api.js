// src/api.js
const API_BASE_URL = 'http://localhost:5002/api';



export const fetchDocuments = async (token, productCode = '') => {
  const url = productCode
    ? `${API_BASE_URL}/documents/${productCode}`
    : `${API_BASE_URL}/documents`;

  console.log('Fetching documents from:', url); // Debugging
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Errore nel recupero dei documenti');

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
              'Authorization': `Bearer ${token}`,
          },
          body: formData,
      });

      if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.message || 'Errore nel caricamento del documento');
      }

      return await response.json();
  } catch (error) {
      console.error('Upload document error:', error);
      throw error;
  }
};



export const deleteDocument = async (token, documentId) => {
  console.log('documentId passed to deleteDocument:', documentId); // Log del documentId
  const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Errore nella cancellazione del documento');
  return await response.json();
};


export const fetchDocumentId = async (token, productCode, productName) => {
  try {
    const url = `${API_BASE_URL}/documents/${productCode}/${encodeURIComponent(productName)}`;
    console.log(`Fetching document ID from URL: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
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
  const url = `${API_BASE_URL}/documents/code/${documentCode}`; // Usa l'endpoint corretto

  console.log('Fetching document by code from:', url); // Debugging
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Errore nel recupero del documento');

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
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ name: newProductName, code: newProductCode }),
  });

  if (!response.ok) throw new Error('Errore nella creazione del prodotto');
  return await response.json();
};


export const fetchProducts = async (token) => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Errore nel recupero dei prodotti');
  return await response.json();
};



export const deleteProduct = async (token, productCode, productName) => {
  const response = await fetch(`http://localhost:5002/api/products/${productCode}/${productName}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Errore nella cancellazione del prodotto: ${response.status}`);
  }

  return response.json(); // Opzionale, puoi restituire il messaggio di successo
};





