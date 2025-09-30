export const autokeyCipher = (input: string, keyword: string, encode: boolean): string => {
  let normalizedKey = keyword.toUpperCase().replace(/[^A-Z]/g, '');

  if (encode) {
    normalizedKey += input.toUpperCase().replace(/[^A-Z]/g, '');
  }

  if (normalizedKey.length === 0) return input;
  
  let result = '';
  let keyIndex = 0;
  
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    
    if (/[A-Za-z]/.test(char)) {
      const isUpperCase = char === char.toUpperCase();
      const charCode = char.toUpperCase().charCodeAt(0) - 65;
      const keyChar = normalizedKey[keyIndex].charCodeAt(0) - 65;
      
      let newCharCode;
      if (encode) {
        newCharCode = (charCode + keyChar) % 26;
      } else {
        newCharCode = (charCode - keyChar + 26) % 26;
      }
      
      const newChar = String.fromCharCode(newCharCode + 65);
      if (!encode) { normalizedKey += newChar; }
      result += isUpperCase ? newChar : newChar.toLowerCase();
      keyIndex++;
    } else {
      result += char;
    }
  }
  
  return result;
};

// The less secure but simpler cipher creditted to Vigenere. Unusued in this application. Included for reference.
export const vigenereCipher = (input: string, keyword: string, encode: boolean): string => {
    const normalizedKey = keyword.toUpperCase().replace(/[^A-Z]/g, '');
    if (normalizedKey.length === 0) return input;
    
    let result = '';
    let keyIndex = 0;
    
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      
      if (/[A-Za-z]/.test(char)) {
        const isUpperCase = char === char.toUpperCase();
        const charCode = char.toUpperCase().charCodeAt(0) - 65;
        const keyChar = normalizedKey[keyIndex % normalizedKey.length].charCodeAt(0) - 65;
        
        let newCharCode;
        if (encode) {
          newCharCode = (charCode + keyChar) % 26;
        } else {
          newCharCode = (charCode - keyChar + 26) % 26;
        }
        
        const newChar = String.fromCharCode(newCharCode + 65);
        result += isUpperCase ? newChar : newChar.toLowerCase();
        keyIndex++;
      } else {
        result += char;
      }
    }
    
    return result;
  };