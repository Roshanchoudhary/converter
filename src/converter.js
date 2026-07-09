import { devanagariToTirhuta, tirhutaToDevanagari, conjuncts } from './devanagari-to-tirhuta.js';

export class ScriptConverter {
  constructor() {
    this.devanagariMap = devanagariToTirhuta;
    this.tirhutaMap = tirhutaToDevanagari;
    this.conjuncts = conjuncts;
  }

  // Convert Devanagari to Tirhuta
  devanagariToTirhuta(text) {
    if (!text || typeof text !== 'string') return '';
    
    let result = '';
    let i = 0;
    const len = text.length;

    while (i < len) {
      let matched = false;
      
      // Check for 3-character conjuncts
      if (i + 2 < len) {
        const threeChar = text.substring(i, i + 3);
        if (this.conjuncts[threeChar]) {
          result += this.conjuncts[threeChar];
          i += 3;
          matched = true;
          continue;
        }
      }
      
      // Check for 2-character conjuncts
      if (i + 1 < len) {
        const twoChar = text.substring(i, i + 2);
        if (this.conjuncts[twoChar]) {
          result += this.conjuncts[twoChar];
          i += 2;
          matched = true;
          continue;
        }
      }

      // Check for double character (like '॥')
      if (i + 1 < len && text.substring(i, i + 2) === '॥') {
        result += this.devanagariMap['॥'] || '॥';
        i += 2;
        matched = true;
        continue;
      }
      
      // Single character mapping
      const char = text[i];
      const mapped = this.devanagariMap[char];
      
      if (mapped !== undefined) {
        result += mapped;
      } else {
        // Keep unmapped characters as is
        result += char;
      }
      i++;
    }
    
    return result;
  }

  // Convert Tirhuta to Devanagari
  tirhutaToDevanagari(text) {
    if (!text || typeof text !== 'string') return '';
    
    let result = '';
    let i = 0;
    const len = text.length;

    // Handle Unicode surrogate pairs
    while (i < len) {
      let char = text[i];
      let charCode = char.charCodeAt(0);
      
      // Check if it's a high surrogate (Tirhuta characters)
      if (charCode >= 0xD811 && charCode <= 0xD811 && i + 1 < len) {
        const nextChar = text[i + 1];
        if (nextChar.charCodeAt(0) >= 0xDC80 && nextChar.charCodeAt(0) <= 0xDCDF) {
          char = text.substring(i, i + 2);
          i += 2;
        } else {
          i++;
        }
      } else {
        i++;
      }
      
      const mapped = this.tirhutaMap[char];
      if (mapped !== undefined) {
        result += mapped;
      } else {
        result += char;
      }
    }
    
    return result;
  }

  // Auto-detect script direction
  detectScript(text) {
    if (!text || typeof text !== 'string') return 'unknown';
    
    // Check for Tirhuta Unicode range (U+11480-U+114DF)
    const tirhutaRegex = /[\u{11480}-\u{114DF}]/u;
    if (tirhutaRegex.test(text)) {
      return 'tirhuta';
    }
    
    // Check for Devanagari Unicode range (U+0900-U+097F)
    const devanagariRegex = /[\u{0900}-\u{097F}]/u;
    if (devanagariRegex.test(text)) {
      return 'devanagari';
    }
    
    return 'unknown';
  }

  // Main conversion method
  convert(text, direction) {
    try {
      if (!text) {
        return { success: false, error: 'No text provided' };
      }

      let result;
      let detectedDirection = direction;

      // Auto-detect if direction not specified
      if (!direction || direction === 'auto') {
        const script = this.detectScript(text);
        if (script === 'devanagari') {
          direction = 'dev-to-tir';
        } else if (script === 'tirhuta') {
          direction = 'tir-to-dev';
        } else {
          return { 
            success: false, 
            error: 'Unable to detect script. Please specify direction.' 
          };
        }
      }

      // Perform conversion
      if (direction === 'dev-to-tir') {
        result = this.devanagariToTirhuta(text);
      } else if (direction === 'tir-to-dev') {
        result = this.tirhutaToDevanagari(text);
      } else {
        return { 
          success: false, 
          error: 'Invalid direction. Use "dev-to-tir", "tir-to-dev", or "auto"' 
        };
      }

      return {
        success: true,
        result,
        direction,
        originalLength: text.length,
        resultLength: result.length,
        detectedScript: this.detectScript(text)
      };
      
    } catch (error) {
      console.error('Conversion error:', error);
      return { 
        success: false, 
        error: error.message || 'Conversion failed' 
      };
    }
  }

  // Batch conversion for multiple texts
  batchConvert(texts, direction) {
    if (!Array.isArray(texts)) {
      return { success: false, error: 'Input must be an array' };
    }
    
    const results = texts.map(text => this.convert(text, direction));
    return {
      success: true,
      results,
      total: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    };
  }

  // Get character statistics
  getStats(text) {
    if (!text) return { success: false, error: 'No text provided' };
    
    const totalChars = text.length;
    const uniqueChars = new Set(text).size;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text.split('\n').length;
    
    return {
      success: true,
      totalCharacters: totalChars,
      uniqueCharacters: uniqueChars,
      words,
      lines,
      script: this.detectScript(text)
    };
  }
}

// Default export
export default ScriptConverter;
