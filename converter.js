const { devanagariToTirhuta, tirhutaToDevanagari } = require('./devnagari-to-tirhuta');

class ScriptConverter {
  constructor() {
    this.devanagariMap = devanagariToTirhuta;
    this.tirhutaMap = tirhutaToDevanagari;
  }

  // Convert Devanagari to Tirhuta
  devanagariToTirhuta(text) {
    if (!text) return '';
    
    let result = '';
    let i = 0;
    
    while (i < text.length) {
      // Check for double character (like '॥')
      if (i + 1 < text.length && text.substring(i, i + 2) === '॥') {
        result += this.devanagariMap['॥'] || '॥';
        i += 2;
        continue;
      }
      
      const char = text[i];
      const mapped = this.devanagariMap[char];
      
      if (mapped) {
        result += mapped;
      } else {
        // Keep unmapped characters as is (like spaces, punctuation)
        result += char;
      }
      i++;
    }
    
    return result;
  }

  // Convert Tirhuta to Devanagari
  tirhutaToDevanagari(text) {
    if (!text) return '';
    
    let result = '';
    let i = 0;
    
    // Handle surrogate pairs for Unicode characters
    while (i < text.length) {
      let char = text[i];
      
      // Check if it's a surrogate pair (Tirhuta characters are in U+11480-U+114DF)
      if (i + 1 < text.length && 
          char >= '\uD811' && char <= '\uD811' && 
          text[i + 1] >= '\uDC80' && text[i + 1] <= '\uDCDF') {
        // Combine surrogate pair
        char = text.substring(i, i + 2);
        i += 2;
      } else {
        i++;
      }
      
      const mapped = this.tirhutaMap[char];
      if (mapped) {
        result += mapped;
      } else {
        // Keep unmapped characters as is
        result += char;
      }
    }
    
    return result;
  }

  // Convert both ways with error handling
  convert(text, direction) {
    try {
      if (direction === 'dev-to-tir') {
        return this.devanagariToTirhuta(text);
      } else if (direction === 'tir-to-dev') {
        return this.tirhutaToDevanagari(text);
      } else {
        throw new Error('Invalid direction. Use "dev-to-tir" or "tir-to-dev"');
      }
    } catch (error) {
      console.error('Conversion error:', error);
      return text; // Return original text on error
    }
  }
}

module.exports = ScriptConverter;
