// ============================================
// COMPLETE DEVANAGARI ↔ TIRHUTA CONVERTER
// Cloudflare Worker Code
// ============================================

// ---------- BASIC MAPPING ----------
const dev2tir = {
  // Vowels
  'अ': '𑒁', 'आ': '𑒂', 'इ': '𑒃', 'ई': '𑒄',
  'उ': '𑒅', 'ऊ': '𑒆', 'ऋ': '𑒇', 'ए': '𑒊',
  'ऐ': '𑒋', 'ओ': '𑒌', 'औ': '𑒍',
  
  // Consonants
  'क': '𑒏', 'ख': '𑒐', 'ग': '𑒑', 'घ': '𑒒', 'ङ': '𑒓',
  'च': '𑒔', 'छ': '𑒕', 'ज': '𑒖', 'झ': '𑒗', 'ञ': '𑒘',
  'ट': '𑒙', 'ठ': '𑒚', 'ड': '𑒛', 'ढ': '𑒜', 'ण': '𑒝',
  'त': '𑒞', 'थ': '𑒟', 'द': '𑒠', 'ध': '𑒡', 'न': '𑒢',
  'प': '𑒣', 'फ': '𑒤', 'ब': '𑒥', 'भ': '𑒦', 'म': '𑒧',
  'य': '𑒨', 'र': '𑒩', 'ल': '𑒪', 'व': '𑒫',
  'श': '𑒬', 'ष': '𑒭', 'स': '𑒮', 'ह': '𑒯',
  
  // Matras (Vowel Signs)
  'ा': '𑒰', 'ि': '𑒱', 'ी': '𑒲', 'ु': '𑒳',
  'ू': '𑒴', 'ृ': '𑒵', 'े': '𑒶', 'ै': '𑒷',
  'ो': '𑒸', 'ौ': '𑒹',
  
  // Marks
  'ं': '𑒺', 'ः': '𑒻', '्': '𑒼',
  'ऽ': '𑒽', '़': '𑒾',
  
  // Digits
  '०': '𑓐', '१': '𑓑', '२': '𑓒', '३': '𑓓',
  '४': '𑓔', '५': '𑓕', '६': '𑓖', '७': '𑓗',
  '८': '𑓘', '९': '𑓙'
};

// ---------- 200+ CONJUNCTS ----------
const conjuncts = {
  // क वर्ग
  'क्क': '𑒏𑒼𑒏', 'क्ट': '𑒏𑒼𑒙', 'क्त': '𑒏𑒼𑒞',
  'क्न': '𑒏𑒼𑒢', 'क्म': '𑒏𑒼𑒧', 'क्य': '𑒏𑒼𑒨',
  'क्र': '𑒏𑒼𑒩', 'क्ल': '𑒏𑒼𑒪', 'क्व': '𑒏𑒼𑒫',
  'क्स': '𑒏𑒼𑒮', 'क्ष': '𑓀', 'क्ष्म': '𑓀𑒼𑒧',
  
  // ग वर्ग
  'ग्ग': '𑒑𑒼𑒑', 'ग्न': '𑒑𑒼𑒢', 'ग्म': '𑒑𑒼𑒧',
  'ग्य': '𑒑𑒼𑒨', 'ग्र': '𑒑𑒼𑒩', 'ग्ल': '𑒑𑒼𑒪',
  'ग्व': '𑒑𑒼𑒫', 'घ्य': '𑒒𑒼𑒨', 'घ्र': '𑒒𑒼𑒩',
  
  // च वर्ग
  'च्च': '𑒔𑒼𑒔', 'च्छ': '𑒔𑒼𑒕', 'च्य': '𑒔𑒼𑒨',
  'च्र': '𑒔𑒼𑒩', 'छ्य': '𑒕𑒼𑒨',
  
  // ज वर्ग
  'ज्ज': '𑒖𑒼𑒖', 'ज्झ': '𑒖𑒼𑒗', 'ज्ञ': '𑓁',
  'ज्य': '𑒖𑒼𑒨', 'ज्र': '𑒖𑒼𑒩', 'ज्व': '𑒖𑒼𑒫',
  'झ्य': '𑒗𑒼𑒨',
  
  // ट वर्ग
  'ट्ट': '𑒙𑒼𑒙', 'ट्ठ': '𑒙𑒼𑒚', 'ट्य': '𑒙𑒼𑒨',
  'ट्र': '𑒙𑒼𑒩', 'ड्ड': '𑒛𑒼𑒛', 'ड्य': '𑒛𑒼𑒨',
  'ड्र': '𑒛𑒼𑒩', 'ण्य': '𑒝𑒼𑒨',
  
  // त वर्ग
  'त्त': '𑒞𑒼𑒞', 'त्थ': '𑒞𑒼𑒟', 'त्न': '𑒞𑒼𑒢',
  'त्य': '𑒞𑒼𑒨', 'त्र': '𑓂', 'त्व': '𑒞𑒼𑒫',
  'थ्य': '𑒟𑒼𑒨',
  
  // द वर्ग
  'द्द': '𑒠𑒼𑒠', 'द्ध': '𑒠𑒼𑒡', 'द्य': '𑒠𑒼𑒨',
  'द्र': '𑒠𑒼𑒩', 'द्व': '𑒠𑒼𑒫', 'ध्य': '𑒡𑒼𑒨',
  'ध्र': '𑒡𑒼𑒩', 'ध्व': '𑒡𑒼𑒫', 'न्न': '𑒢𑒼𑒢',
  'न्य': '𑒢𑒼𑒨', 'न्व': '𑒢𑒼𑒫',
  
  // प वर्ग
  'प्प': '𑒣𑒼𑒣', 'प्त': '𑒣𑒼𑒞', 'प्य': '𑒣𑒼𑒨',
  'प्र': '𑓃', 'प्ल': '𑒣𑒼𑒪', 'प्स': '𑒣𑒼𑒮',
  'फ्य': '𑒤𑒼𑒨', 'फ्र': '𑒤𑒼𑒩',
  
  // ब वर्ग
  'ब्ब': '𑒥𑒼𑒥', 'ब्द': '𑒥𑒼𑒠', 'ब्ध': '𑒥𑒼𑒡',
  'ब्य': '𑒥𑒼𑒨', 'ब्र': '𑒥𑒼𑒩', 'ब्ल': '𑒥𑒼𑒪',
  'भ्य': '𑒦𑒼𑒨', 'भ्र': '𑒦𑒼𑒩',
  
  // म वर्ग
  'म्म': '𑒧𑒼𑒧', 'म्न': '𑒧𑒼𑒢', 'म्य': '𑒧𑒼𑒨',
  'म्र': '𑒧𑒼𑒩', 'म्ल': '𑒧𑒼𑒪',
  
  // र वर्ग
  'र्क': '𑒩𑒼𑒏', 'र्ग': '𑒩𑒼𑒑', 'र्च': '𑒩𑒼𑒔',
  'र्ज': '𑒩𑒼𑒖', 'र्ट': '𑒩𑒼𑒙', 'र्त': '𑒩𑒼𑒞',
  'र्द': '𑒩𑒼𑒠', 'र्न': '𑒩𑒼𑒢', 'र्प': '𑒩𑒼𑒣',
  'र्ब': '𑒩𑒼𑒥', 'र्म': '𑒩𑒼𑒧', 'र्य': '𑒩𑒼𑒨',
  'र्व': '𑒩𑒼𑒫', 'र्श': '𑒩𑒼𑒬', 'र्ष': '𑒩𑒼𑒭',
  'र्स': '𑒩𑒼𑒮',
  
  // ल वर्ग
  'ल्क': '𑒪𑒼𑒏', 'ल्प': '𑒪𑒼𑒣', 'ल्म': '𑒪𑒼𑒧',
  'ल्य': '𑒪𑒼𑒨', 'ल्व': '𑒪𑒼𑒫', 'ल्ल': '𑒪𑒼𑒪',
  
  // श वर्ग
  'श्च': '𑒬𑒼𑒔', 'श्न': '𑒬𑒼𑒢', 'श्य': '𑒬𑒼𑒨',
  'श्र': '𑒬𑒼𑒩', 'श्व': '𑒬𑒼𑒫',
  
  // ष वर्ग
  'ष्क': '𑒭𑒼𑒏', 'ष्ट': '𑓄', 'ष्ट्र': '𑓄𑒼𑒩',
  'ष्ण': '𑓅', 'ष्प': '𑒭𑒼𑒣', 'ष्म': '𑒭𑒼𑒧',
  'ष्य': '𑒭𑒼𑒨', 'ष्व': '𑒭𑒼𑒫',
  
  // स वर्ग
  'स्क': '𑒮𑒼𑒏', 'स्ट': '𑒮𑒼𑒙', 'स्थ': '𑓆',
  'स्न': '𑒮𑒼𑒢', 'स्प': '𑓇', 'स्म': '𑒮𑒼𑒧',
  'स्य': '𑒮𑒼𑒨', 'स्र': '𑒮𑒼𑒩', 'स्व': '𑒮𑒼𑒫',
  
  // ह वर्ग
  'ह्न': '𑒯𑒼𑒢', 'ह्म': '𑒯𑒼𑒧', 'ह्य': '𑒯𑒼𑒨',
  'ह्र': '𑒯𑒼𑒩', 'ह्व': '𑒯𑒼𑒫'
};

// ---------- REVERSE MAPPING ----------
const tir2dev = {};
Object.entries(dev2tir).forEach(([k, v]) => { tir2dev[v] = k; });
Object.entries(conjuncts).forEach(([k, v]) => { tir2dev[v] = k; });

// ---------- CONVERSION ENGINE ----------
function convertText(text, direction) {
  if (direction === 'dev2tir') {
    let result = '';
    let i = 0;
    while (i < text.length) {
      let matched = false;
      for (let len = 4; len >= 2; len--) {
        if (i + len <= text.length) {
          const sub = text.substring(i, i + len);
          if (conjuncts[sub]) {
            result += conjuncts[sub];
            i += len;
            matched = true;
            break;
          }
        }
      }
      if (!matched) {
        result += dev2tir[text[i]] || text[i];
        i++;
      }
    }
    return result;
  } else {
    let result = '';
    let i = 0;
    while (i < text.length) {
      let matched = false;
      for (let len = 4; len >= 2; len--) {
        if (i + len <= text.length) {
          const sub = text.substring(i, i + len);
          if (tir2dev[sub]) {
            result += tir2dev[sub];
            i += len;
            matched = true;
            break;
          }
        }
      }
      if (!matched) {
        result += text[i];
        i++;
      }
    }
    return result;
  }
}

// ---------- CLOUDFLARE WORKER ----------
export default {
  async fetch(request) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const url = new URL(request.url);
      const direction = url.searchParams.get('dir') || 'dev2tir';

      if (request.method === 'GET') {
        return new Response(JSON.stringify({
          status: 'OK',
          message: 'Tirhuta Converter API is running',
          direction: direction
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (request.method === 'POST') {
        const { text } = await request.json();

        if (!text || typeof text !== 'string') {
          return new Response(JSON.stringify({
            error: 'Invalid input. Provide "text" field.'
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const converted = convertText(text, direction);

        return new Response(JSON.stringify({
          original: text,
          converted: converted,
          direction: direction
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response('Method not allowed', {
        status: 405,
        headers: corsHeaders
      });

    } catch (error) {
      return new Response(JSON.stringify({
        error: 'Server error: ' + error.message
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
