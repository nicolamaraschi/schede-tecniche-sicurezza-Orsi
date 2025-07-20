import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './ContattiPage.css';

const ContattiPage = () => {
  const { t } = useLanguage();

  return (
    <div className="contatti-container">
      <h1>{t('contacts_title')}</h1>
      <p>{t('contacts_intro')}</p>

      <div className="info-section">
        <h2>{t('company_info_title')}</h2>
        <p><strong>{t('company')}:</strong> Orsi S.R.L.</p>
        <p><strong>{t('vat_number')}:</strong> IT 00829301209</p>
        <p><strong>{t('rea')}:</strong> BO 367676</p>
        <p><strong>{t('cf')}:</strong> 01995970363</p>
      </div>

      <div className="info-section">
        <h2>{t('legal_headquarters_title')}</h2>
        <p><strong>{t('address')}:</strong> Via C. Bassi 22, 40015 Galliera (BO), Italia</p>
      </div>

      <div className="info-section">
        <h2>{t('direct_contacts_title')}</h2>
        <p><strong>{t('phone')}:</strong> +39 051 6671000</p>
        <p><strong>{t('email')}:</strong> info@orsidetersivi.com</p>
        <p><strong>{t('pec')}:</strong> orsidetersivi@pec.it</p>
      </div>

      <div className="info-section">
        <h2>{t('office_hours_title')}</h2>
        <p><strong>{t('mon_fri')}:</strong> 9:00 - 18:00</p>
        <p><strong>{t('saturday')}:</strong> {t('closed')}</p>
        <p><strong>{t('sunday')}:</strong> {t('closed')}</p>
      </div>
    </div>
  );
};

export default ContattiPage;
