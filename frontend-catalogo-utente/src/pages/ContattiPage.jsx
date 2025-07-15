import React from 'react';
import './ContattiPage.css';

const ContattiPage = () => {
  return (
    <div className="contatti-container">
      <h1>CONTATTI</h1>
      <p>Siamo qui per rispondere a qualsiasi domanda sui nostri prodotti e servizi. Non esitate a contattarci per ulteriori informazioni.</p>

      <div className="info-section">
        <h2>Informazioni Aziendali</h2>
        <p><strong>Azienda:</strong> Orsi S.R.L.</p>
        <p><strong>P.IVA:</strong> IT 00829301209</p>
        <p><strong>REA:</strong> BO 367676</p>
        <p><strong>C.F.:</strong> 01995970363</p>
      </div>

      <div className="info-section">
        <h2>Sede Legale</h2>
        <p><strong>Indirizzo:</strong> Via C. Bassi 22, 40015 Galliera (BO), Italia</p>
      </div>

      <div className="info-section">
        <h2>Contatti Diretti</h2>
        <p><strong>Telefono:</strong> +39 051 6671000</p>
        <p><strong>Email:</strong> info@orsidetersivi.com</p>
        <p><strong>PEC:</strong> orsidetersivi@pec.it</p>
      </div>

      <div className="info-section">
        <h2>Orari Ufficio</h2>
        <p><strong>Lun-Ven:</strong> 9:00 - 18:00</p>
        <p><strong>Sabato:</strong> Chiuso</p>
        <p><strong>Domenica:</strong> Chiuso</p>
      </div>
    </div>
  );
};

export default ContattiPage;
