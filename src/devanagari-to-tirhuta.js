// Complete character mapping for Devanagari to Tirhuta
export const devanagariToTirhuta = {
  // Vowels (Swar)
  'अ': '𑒁', 'आ': '𑒂', 'इ': '𑒃', 'ई': '𑒄',
  'उ': '𑒅', 'ऊ': '𑒆', 'ऋ': '𑒇', 'ॠ': '𑒈',
  'ऌ': '𑒉', 'ॡ': '𑒊', 'ए': '𑒋', 'ऐ': '𑒌',
  'ओ': '𑒍', 'औ': '𑒎',
  
  // Consonants (Vyanjan)
  'क': '𑒏', 'ख': '𑒐', 'ग': '𑒑', 'घ': '𑒒',
  'ङ': '𑒓', 'च': '𑒔', 'छ': '𑒕', 'ज': '𑒖',
  'झ': '𑒗', 'ञ': '𑒘', 'ट': '𑒙', 'ठ': '𑒚',
  'ड': '𑒛', 'ढ': '𑒜', 'ण': '𑒝', 'त': '𑒞',
  'थ': '𑒟', 'द': '𑒠', 'ध': '𑒡', 'न': '𑒢',
  'प': '𑒣', 'फ': '𑒤', 'ब': '𑒥', 'भ': '𑒦',
  'म': '𑒧', 'य': '𑒨', 'र': '𑒩', 'ल': '𑒪',
  'व': '𑒫', 'श': '𑒬', 'ष': '𑒭', 'स': '𑒮',
  'ह': '𑒯',
  
  // Matras (Vowel signs)
  'ा': '𑒰', 'ि': '𑒱', 'ी': '𑒲', 
  'ु': '𑒳', 'ू': '𑒴', 'ृ': '𑒵', 'ॄ': '𑒶',
  'ॅ': '𑒷', 'े': '𑒸', 'ै': '𑒹', 
  'ो': '𑒺', 'ौ': '𑒻',
  
  // Other signs
  'ं': '𑒼', // Anusvara
  'ः': '𑒽', // Visarga
  'ँ': '𑒾', // Chandrabindu
  '़': '𑒿', // Nukta
  '्': '𑓀', // Virama (Halant)
  'ऽ': '𑓁', // Avagraha
  
  // Numbers
  '०': '𑓐', '१': '𑓑', '२': '𑓒', '३': '𑓓',
  '४': '𑓔', '५': '𑓕', '६': '𑓖', '७': '𑓗',
  '८': '𑓘', '९': '𑓙',
  
  // Punctuation
  '।': '𑓂', // Danda
  '॥': '𑓃', // Double Danda
  ' ': ' ',  // Space
  '\n': '\n' // Newline
};

// Reverse mapping for Tirhuta to Devanagari
export const tirhutaToDevanagari = {};
for (const [dev, tir] of Object.entries(devanagariToTirhuta)) {
  tirhutaToDevanagari[tir] = dev;
}

// Add support for common conjuncts
export const conjuncts = {
  'क्‍ष': '𑒏𑓀𑒭', // ksh
  'त्र': '𑒞𑓀𑒩', // tra
  'ज्ञ': '𑒖𑓀𑒘', // gya
  'श्र': '𑒬𑓀𑒩', // shra
};

// Default export for backward compatibility
export default { devanagariToTirhuta, tirhutaToDevanagari, conjuncts };
