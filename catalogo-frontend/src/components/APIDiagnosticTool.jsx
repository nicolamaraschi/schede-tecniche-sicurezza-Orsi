import React, { useState, useEffect } from 'react';
import axios from 'axios';

const APIDiagnosticTool = () => {
  const [diagnostics, setDiagnostics] = useState({
    envVariables: {},
    apiUrlTest: null,
    subcategoriesTest: null,
    categoriesTest: null,
    productsTest: null
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    const runDiagnostics = async () => {
      try {
        // Raccolta variabili d'ambiente
        const envVariables = {
          API_URL: process.env.REACT_APP_API_URL,
          TRIMMED_URL: process.env.REACT_APP_API_URL?.trim(),
          URL_LENGTH: process.env.REACT_APP_API_URL?.length
        };

        // Configurazione axios con URL pulito
        const cleanApiUrl = (process.env.REACT_APP_API_URL || '').trim();
        const api = axios.create({
          baseURL: cleanApiUrl,
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        // Test base URL
        let apiUrlTest = null;
        try {
          apiUrlTest = await axios.get(cleanApiUrl);
        } catch (urlError) {
          apiUrlTest = urlError;
        }

        // Test sottocategorie
        let subcategoriesTest = null;
        try {
          subcategoriesTest = await api.get('/prodottiCatalogo/sottocategorie');
        } catch (subError) {
          subcategoriesTest = subError;
        }

        // Test categorie
        let categoriesTest = null;
        try {
          categoriesTest = await api.get('/gestoreProdotti/categorie');
        } catch (catError) {
          categoriesTest = catError;
        }

        // Test prodotti
        let productsTest = null;
        try {
          productsTest = await api.get('/prodottiCatalogo/prodotti');
        } catch (prodError) {
          productsTest = prodError;
        }

        setDiagnostics({
          envVariables,
          apiUrlTest,
          subcategoriesTest,
          categoriesTest,
          productsTest
        });

      } catch (err) {
        setError(err);
      }
    };

    runDiagnostics();
  }, []);

  const renderTestResult = (test) => {
    if (!test) return 'Not tested';
    if (test.response) {
      return `Success (${test.response.status})`;
    }
    return `Error: ${test.message}`;
  };

  return (
    <div style={{ 
      fontFamily: 'monospace', 
      padding: '20px', 
      backgroundColor: '#f0f0f0' 
    }}>
      <h2>API Diagnostic Tool</h2>
      
      <h3>Environment Variables</h3>
      <pre>{JSON.stringify(diagnostics.envVariables, null, 2)}</pre>

      <h3>Tests</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Test</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Base URL Test</td>
            <td>{renderTestResult(diagnostics.apiUrlTest)}</td>
          </tr>
          <tr>
            <td>Subcategories Endpoint</td>
            <td>{renderTestResult(diagnostics.subcategoriesTest)}</td>
          </tr>
          <tr>
            <td>Categories Endpoint</td>
            <td>{renderTestResult(diagnostics.categoriesTest)}</td>
          </tr>
          <tr>
            <td>Products Endpoint</td>
            <td>{renderTestResult(diagnostics.productsTest)}</td>
          </tr>
        </tbody>
      </table>

      {error && (
        <div style={{ color: 'red', marginTop: '20px' }}>
          <h3>Global Error</h3>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default APIDiagnosticTool;