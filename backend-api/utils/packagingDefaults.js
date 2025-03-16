// backend-api/utils/packagingDefaults.js
/**
 * Restituisce i valori predefiniti per unità di imballaggio in base al tipo
 * @param {string} tipoImballaggio - Il tipo di imballaggio
 * @returns {Object} Un oggetto con i valori predefiniti
 */
const getPackagingDefaults = (tipoImballaggio) => {
    switch(tipoImballaggio) {
      case 'Barattolo 1kg':
        return { pezziPerCartone: 6, cartoniPerEpal: 40, pezziPerEpal: 240 };
      case 'BigBag 600kg':
        return { pezziPerCartone: 1, cartoniPerEpal: 1, pezziPerEpal: 1 };
      case 'Flacone 750g':
        return { pezziPerCartone: 15, cartoniPerEpal: 55, pezziPerEpal: 825 };
      case 'Sacco 10kg':
        return { pezziPerCartone: 1, cartoniPerEpal: 60, pezziPerEpal: 60 };
      case 'Sacco 20kg':
        return { pezziPerCartone: 1, cartoniPerEpal: 30, pezziPerEpal: 30 };
      case 'Secchio 200tabs':
        return { pezziPerCartone: 3, cartoniPerEpal: 20, pezziPerEpal: 60 };
      case 'Secchio 3.6kg':
        return { pezziPerCartone: 1, cartoniPerEpal: 200, pezziPerEpal: 200 };
      case 'Secchio 4kg':
        return { pezziPerCartone: 1, cartoniPerEpal: 72, pezziPerEpal: 72 };
      case 'Secchio 5kg':
        return { pezziPerCartone: 1, cartoniPerEpal: 72, pezziPerEpal: 72 };
      case 'Secchio 6kg':
        return { pezziPerCartone: 1, cartoniPerEpal: 72, pezziPerEpal: 72 };
      case 'Secchio 8kg':
        return { pezziPerCartone: 1, cartoniPerEpal: 36, pezziPerEpal: 36 };
      case 'Secchio 9kg':
        return { pezziPerCartone: 1, cartoniPerEpal: 36, pezziPerEpal: 36 };
      case 'Secchio 10kg':
        return { pezziPerCartone: 1, cartoniPerEpal: 72, pezziPerEpal: 72 };
      case 'Astuccio 100g':
        return { pezziPerCartone: 100, cartoniPerEpal: 1, pezziPerEpal: 100 };
      case 'Astuccio 700g':
        return { pezziPerCartone: 12, cartoniPerEpal: 72, pezziPerEpal: 864 };
      case 'Astuccio 2400g':
        return { pezziPerCartone: 4, cartoniPerEpal: 50, pezziPerEpal: 200 };
      case 'Astuccio 900g':
        return { pezziPerCartone: 12, cartoniPerEpal: 60, pezziPerEpal: 720 };
      case 'Astuccio 200g':
        return { pezziPerCartone: 8, cartoniPerEpal: 135, pezziPerEpal: 1080 };
      case 'Flacone 500ml':
        return { pezziPerCartone: 12, cartoniPerEpal: 48, pezziPerEpal: 576 };
      case 'Flacone Trigger 750ml':
        return { pezziPerCartone: 12, cartoniPerEpal: 40, pezziPerEpal: 480 };
      case 'Tanica 1000l':
        return { pezziPerCartone: 1, cartoniPerEpal: 1, pezziPerEpal: 1 };
      case 'Flacone 5l':
        return { pezziPerCartone: 4, cartoniPerEpal: 34, pezziPerEpal: 136 };
      case 'Fustone 5.6kg':
        return { pezziPerCartone: 1, cartoniPerEpal: 84, pezziPerEpal: 84 };
      case 'Cartone 400tabs':
        return { pezziPerCartone: 1, cartoniPerEpal: 60, pezziPerEpal: 60 };
      default:
        return { pezziPerCartone: null, cartoniPerEpal: null, pezziPerEpal: null };
    }
  };
  
  module.exports = { getPackagingDefaults };