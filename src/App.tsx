import React, { useState } from 'react';
import { Lock, Unlock, Copy, Check } from 'lucide-react';

const VigenereCipher: React.FC = () => {
  const [encodeText, setEncodeText] = useState('');
  const [encodeKey, setEncodeKey] = useState('');
  const [encodeResult, setEncodeResult] = useState('');
  const [decodeText, setDecodeText] = useState('');
  const [decodeKey, setDecodeKey] = useState('');
  const [decodeResult, setDecodeResult] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  const processText = (input: string, keyword: string, encode: boolean): string => {
    if (!keyword) return input;
    
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

  const handleEncodeProcess = () => {
    if (!encodeText || !encodeKey) {
      setEncodeResult('');
      return;
    }
    
    const processed = processText(encodeText, encodeKey, true);
    setEncodeResult(processed);
  };

  const handleDecodeProcess = () => {
    if (!decodeText || !decodeKey) {
      setDecodeResult('');
      return;
    }
    
    const processed = processText(decodeText, decodeKey, false);
    setDecodeResult(processed);
  };

  const handleCopy = async () => {
    const textToCopy = mode === 'encode' ? encodeResult : decodeResult;
    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const switchMode = (newMode: 'encode' | 'decode') => {
    setMode(newMode);
  };

  React.useEffect(() => {
    if (mode === 'encode') {
      handleEncodeProcess();
    } else {
      handleDecodeProcess();
    }
  }, [encodeText, encodeKey, decodeText, decodeKey, mode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 mt-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Vigenère Cipher
            </h1>
            <p className="text-gray-600">
              A classic polyalphabetic substitution cipher
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 rounded-lg p-1 inline-flex">
              <button
                onClick={() => switchMode('encode')}
                className={`px-6 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
                  mode === 'encode'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Lock size={18} />
                Encode
              </button>
              <button
                onClick={() => switchMode('decode')}
                className={`px-6 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
                  mode === 'decode'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Unlock size={18} />
                Decode
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Key (Letters only)
              </label>
              <input
                type="text"
                value={mode === 'encode' ? encodeKey : decodeKey}
                onChange={(e) => mode === 'encode' ? setEncodeKey(e.target.value) : setDecodeKey(e.target.value)}
                placeholder="Enter your key (e.g., SECRET)"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors text-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Only letters will be used. Non-alphabetic characters will be ignored.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {mode === 'encode' ? 'Plain Text' : 'Cipher Text'}
              </label>
              <textarea
                value={mode === 'encode' ? encodeText : decodeText}
                onChange={(e) => mode === 'encode' ? setEncodeText(e.target.value) : setDecodeText(e.target.value)}
                placeholder={`Enter text to ${mode}...`}
                rows={6}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors resize-none text-lg"
              />
            </div>

            {(mode === 'encode' ? encodeResult : decodeResult) && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    {mode === 'encode' ? 'Cipher Text' : 'Plain Text'}
                  </label>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check size={16} className="text-green-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="w-full px-4 py-3 bg-indigo-50 border-2 border-indigo-200 rounded-lg text-lg whitespace-pre-wrap break-words min-h-[150px]">
                  {mode === 'encode' ? encodeResult : decodeResult}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">How it works:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• The Vigenère cipher uses a keyword to shift letters in the alphabet</li>
              <li>• Each letter in the key determines how many positions to shift</li>
              <li>• Non-alphabetic characters (spaces, punctuation) remain unchanged</li>
              <li>• The key repeats if it's shorter than the message</li>
            </ul>
            <h3 className="font-semibold text-gray-700 mb-2 mt-10 text-center">Application created by Rohan Iyer</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VigenereCipher;